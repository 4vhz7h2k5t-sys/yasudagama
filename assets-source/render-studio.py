"""Render the conceptual pottery used in the web studio.

Run with Blender in background mode from the repository root:
  Blender -b --factory-startup --python assets-source/render-studio.py -- /tmp/yasudagama-renders
"""
import json
import math
import pathlib
import sys

import bpy
from mathutils import Vector

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROFILES = json.loads((ROOT / "src/profiles.json").read_text())
OUTPUT = pathlib.Path(sys.argv[sys.argv.index("--") + 1])
OUTPUT.mkdir(parents=True, exist_ok=True)


def rgb(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v < 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values) + (1,)


def ramp(nodes, colors, positions):
    node = nodes.new("ShaderNodeValToRGB")
    for index, (color, position) in enumerate(zip(colors, positions)):
        stop = node.color_ramp.elements[index] if index < 2 else node.color_ramp.elements.new(position)
        stop.position = position
        stop.color = rgb(color)
    return node


def surface(name, colors, roughness, glaze=True):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Coat Weight"].default_value = 0.31 if glaze else 0.0
    shader.inputs["Coat Roughness"].default_value = 0.28
    coords = nodes.new("ShaderNodeTexCoord")
    def noise(scale, detail):
        node = nodes.new("ShaderNodeTexNoise")
        node.inputs["Scale"].default_value = scale
        node.inputs["Detail"].default_value = detail
        links.new(coords.outputs["Object"], node.inputs["Vector"])
        return node
    mottled = noise(7.0, 4)
    grain = noise(180.0, 2)
    flecks = noise(73, 2)
    color = ramp(nodes, colors, (0.19, 0.81, 0.50))
    links.new(mottled.outputs["Fac"], color.inputs["Fac"])
    freckles = ramp(nodes, ("ffffff", "423322"), (0.63, 0.78))
    links.new(flecks.outputs["Fac"], freckles.inputs["Fac"])
    speckle = nodes.new("ShaderNodeMixRGB")
    speckle.blend_type = "MULTIPLY"
    speckle.inputs[0].default_value = 0.72
    links.new(color.outputs["Color"], speckle.inputs[1])
    links.new(freckles.outputs["Color"], speckle.inputs[2])
    if glaze:
        axis = nodes.new("ShaderNodeSeparateXYZ")
        links.new(coords.outputs["Generated"], axis.inputs[0])
        irregularity = nodes.new("ShaderNodeMath")
        irregularity.operation = "MULTIPLY_ADD"
        links.new(mottled.outputs["Fac"], irregularity.inputs[0])
        irregularity.inputs[1].default_value = 0.21
        irregularity.inputs[2].default_value = -0.10
        height = nodes.new("ShaderNodeMath")
        height.operation = "ADD"
        links.new(axis.outputs["Z"], height.inputs[0])
        links.new(irregularity.outputs[0], height.inputs[1])
        boundary = ramp(nodes, ("000000", "ffffff"), (0.18, 0.265))
        links.new(height.outputs[0], boundary.inputs["Fac"])
        mix = nodes.new("ShaderNodeMixRGB")
        links.new(boundary.outputs["Color"], mix.inputs[0])
        mix.inputs[1].default_value = rgb("81563d")
        links.new(speckle.outputs["Color"], mix.inputs[2])
        links.new(mix.outputs["Color"], shader.inputs["Base Color"])
    else:
        links.new(speckle.outputs["Color"], shader.inputs["Base Color"])
    throwing = nodes.new("ShaderNodeTexWave")
    throwing.wave_type = "BANDS"
    throwing.bands_direction = "Z"
    throwing.inputs["Scale"].default_value = 32
    throwing.inputs["Distortion"].default_value = 1.8
    links.new(coords.outputs["Object"], throwing.inputs["Vector"])
    grooves = nodes.new("ShaderNodeBump")
    grooves.inputs["Strength"].default_value = 0.24
    grooves.inputs["Distance"].default_value = 0.012
    links.new(throwing.outputs["Color"], grooves.inputs["Height"])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.30
    bump.inputs["Distance"].default_value = 0.009
    links.new(grain.outputs["Fac"], bump.inputs["Height"])
    links.new(grooves.outputs["Normal"], bump.inputs["Normal"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return mat


def profile_point(points, t):
    u = t * (len(points) - 1)
    index = min(int(u), len(points) - 2)
    x = u - index
    a, b, c, d = (points[min(len(points)-1, max(0, index + j))] for j in (-1, 0, 1, 2))
    return tuple(0.5 * (2*p1 + (-p0+p2)*x + (2*p0-5*p1+4*p2-p3)*x*x +
                        (-p0+3*p1-3*p2+p3)*x*x*x) for p0,p1,p2,p3 in zip(a,b,c,d))


def vessel(name, mat, position=(0,0,0), scale=1.0):
    points = PROFILES[name]
    rings, segments = 104, 144
    verts, faces = [], []
    for i in range(rings + 1):
        radius, height = profile_point(points, i/rings)
        for j in range(segments):
            a = 2 * math.pi * j / segments
            irregular = (0.019 if name == "cup" else 0.011) * math.sin(3*a + height*4)
            r = max(0.0005, radius) * (1 + irregular + 0.009 * math.cos(7*a - height*9))
            z = height + radius * (0.010*math.sin(3*a) + 0.005*math.sin(8*a+2))
            verts.append((r*math.cos(a), r*math.sin(a), z))
            if i:
                base = (i-1)*segments
                n = (j+1)%segments
                faces.append((base+j, base+n, base+segments+n, base+segments+j))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.scale = (scale,)*3
    obj.data.materials.append(mat)
    return obj


def disk(radius, depth, z, mat, bevel):
    bpy.ops.mesh.primitive_cylinder_add(vertices=144, radius=radius, depth=depth, location=(0,0,z))
    obj = bpy.context.object
    obj.data.materials.append(mat)
    mod = obj.modifiers.new("Rounded edge", "BEVEL")
    mod.width, mod.segments = bevel, 4
    obj.modifiers.new("Surface normals", "WEIGHTED_NORMAL")
    for face in obj.data.polygons:
        face.use_smooth = len(face.vertices) == 4


def area(name, position, energy, size, color, target, height):
    light = bpy.data.lights.new(name, "AREA")
    light.shape = "RECTANGLE"
    light.size, light.size_y = size, height
    light.energy, light.color = energy, color
    obj = bpy.data.objects.new(name, light)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render(filename, variant):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 28
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1160
    scene.render.resolution_y = 860
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.world = bpy.data.worlds.new("Studio bounce")
    scene.world.use_nodes = True
    scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.20,0.24,0.23,1)
    scene.world.node_tree.nodes["Background"].inputs[1].default_value = 0.29
    scene.view_settings.view_transform = "AgX"

    olive = surface("Ash glaze", ("414b38","abb086","737e5a"), 0.30)
    cream = surface("Rice glaze", ("746650","dbccad","b4a68e"), 0.44)
    iron = surface("Iron glaze", ("3d2522","be7d54","86503d"), 0.37)
    metal = surface("Patinated wheel", ("161614","3a3229","26241f"), 0.60, False)
    disk(1.34 if variant != "collection" else 2.12, 0.13, -0.065, metal, 0.028)
    disk(1.28 if variant != "collection" else 2.05, 0.15, -0.205, metal, 0.025)
    target = (0,0,0.30)
    if variant == "collection":
        vessel("cup", cream, (-0.72,0.46,0), 0.96)
        vessel("bowl", olive, (0.59,-0.27,0), 0.87)
        vessel("plate", iron, (-0.86,-0.80,0), 0.64)
        target = (0,0,0.32)
    else:
        vessel(variant, {"bowl":olive,"cup":cream,"plate":iron}[variant])

    area("North window", (-3,-3,5.8), 420, 2.5, (1,0.84,0.67), (0,0,0.5), 4.0)
    area("High sidelight", (3.5,2.7,4.8), 330, 2.3, (0.77,0.88,1), (0,0,0.5), 3.0)
    area("Bounce", (0,-4,1.5), 39, 3, (1,0.92,0.8), (0,0,0.4), 2.4)
    bpy.ops.object.camera_add(location=(3.0,-6.1,3.9))
    cam = bpy.context.object
    cam.rotation_euler = (Vector(target) - cam.location).to_track_quat("-Z","Y").to_euler()
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 4.72 if variant == "collection" else 3.45
    scene.camera = cam
    scene.render.filepath = str(OUTPUT / (filename + ".png"))
    bpy.ops.render.render(write_still=True)


for name, variant in [("studio-bowl","bowl"), ("studio-collection","collection"), ("studio-cup","cup"), ("studio-plate","plate")]:
    render(name, variant)
