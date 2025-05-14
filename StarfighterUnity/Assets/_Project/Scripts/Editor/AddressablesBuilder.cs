#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.AddressableAssets.Settings;
using UnityEditor.AddressableAssets.Build;
using UnityEditor.AddressableAssets;

public static class AddressablesBuilder
{
    public static void BuildAddressables()
    {
        AddressableAssetSettings.BuildPlayerContent();
        // Output path is defined in Addressables profile; GitHub CI will push resulting build.
    }
}
#endif 