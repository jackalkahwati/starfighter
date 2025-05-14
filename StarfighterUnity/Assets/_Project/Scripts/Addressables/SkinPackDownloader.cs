#if ADDRESSABLES
using System.Collections;
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public static class SkinPackDownloader
{
    public static IEnumerator DownloadAndApply(ShipSkinSO skin, System.Action onComplete)
    {
        if (skin == null)
        {
            onComplete?.Invoke();
            yield break;
        }

        // Addressable label convention: skins_<skinId>
        string label = $"skins_{skin.Id}";
        var handle = Addressables.DownloadDependenciesAsync(label);
        yield return handle;

        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            Debug.Log($"SkinPackDownloader: Downloaded dependencies for {skin.Id}");
        }
        else
        {
            Debug.LogWarning($"SkinPackDownloader: Failed to download dependencies for {skin.Id}");
        }

        onComplete?.Invoke();
    }
}
#endif 