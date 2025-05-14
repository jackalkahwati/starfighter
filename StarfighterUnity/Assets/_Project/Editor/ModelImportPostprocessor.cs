#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.AssetImporters;
using UnityEngine;

/// <summary>
/// Post-processes imported 3D models (FBX, OBJ, etc.) to enforce mobile-friendly defaults
/// such as mesh compression and LOD generation.
/// </summary>
public class ModelImportPostprocessor : AssetPostprocessor
{
    void OnPreprocessModel()
    {
        if (assetImporter is ModelImporter modelImporter)
        {
            modelImporter.meshCompression = ModelImporterMeshCompression.Medium;
            modelImporter.importBlendShapes = false;
            modelImporter.isReadable = false;
            modelImporter.optimizeMeshPolygons = true;
            modelImporter.optimizeMeshVertices = true;
            modelImporter.animationType = ModelImporterAnimationType.None;
            modelImporter.importCameras = false;
            modelImporter.importLights = false;
        }
    }

    void OnPostprocessModel(GameObject g)
    {
        // Automatically add an LODGroup with 3 levels if missing
        if (!g.TryGetComponent(out LODGroup lodGroup))
        {
            lodGroup = g.AddComponent<LODGroup>();
        }

        var renderers = g.GetComponentsInChildren<Renderer>();
        if (renderers.Length == 0) return;

        var lods = new LOD[3];
        lods[0] = new LOD(0.6f, renderers); // Full-detail
        lods[1] = new LOD(0.3f, renderers); // Half-detail (Unity will compute imposters if missing)
        lods[2] = new LOD(0.1f, new Renderer[0]); // Culled
        lodGroup.SetLODs(lods);
        lodGroup.RecalculateBounds();
    }
}
#endif 