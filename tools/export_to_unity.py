"""
Batch-convert GLTF/GLB files to FBX for Unity while applying mesh decimation.
Run this script from Blender using:
    blender --background --python tools/export_to_unity.py -- <src_dir> <dest_dir>

Dependencies:
    * Blender 3.0+
Notes:
    * Decimation ratio is hard-coded to 0.65 (≈35 % reduction).
    * Emission maps are baked into the FBX material as emissive color, texture
      baking is out of scope—author separate emissive textures if needed.
"""

import bpy
import sys
import os

DECIMATE_RATIO = 0.65


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)


def import_gltf(path):
    bpy.ops.import_scene.gltf(filepath=path)


def export_fbx(path):
    bpy.ops.export_scene.fbx(
        filepath=path,
        use_selection=False,
        apply_unit_scale=True,
        bake_space_transform=True,
        object_types={'MESH'},
        mesh_smooth_type='FACE',
        path_mode='AUTO')


def decimate_all():
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            mod = obj.modifiers.new(name='Decimate', type='DECIMATE')
            mod.ratio = DECIMATE_RATIO
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier=mod.name)


def process_file(src_path, dest_dir):
    clear_scene()
    import_gltf(src_path)
    decimate_all()
    basename = os.path.splitext(os.path.basename(src_path))[0]
    out_path = os.path.join(dest_dir, f"{basename}.fbx")
    export_fbx(out_path)
    print(f"Exported {out_path}")


def main():
    argv = sys.argv
    if '--' not in argv:
        print("Usage: blender --background --python export_to_unity.py -- <src_dir> <dest_dir>")
        return
    argv = argv[argv.index('--') + 1:]
    if len(argv) != 2:
        print("Error: need <src_dir> and <dest_dir>")
        return
    src_dir, dest_dir = argv
    os.makedirs(dest_dir, exist_ok=True)
    for file in os.listdir(src_dir):
        if file.lower().endswith(('.gltf', '.glb')):
            process_file(os.path.join(src_dir, file), dest_dir)


if __name__ == '__main__':
    main() 