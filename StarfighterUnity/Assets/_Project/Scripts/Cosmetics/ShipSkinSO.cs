using UnityEngine;

[CreateAssetMenu(menuName = "Starfighter/Skin", fileName = "ShipSkinSO")]
public class ShipSkinSO : ScriptableObject
{
    [Header("Identity")]
    public string Id = "default";
    public string DisplayName = "Default Skin";
    public string IAPId; // Non-consumable product identifier for IAP

    [Header("Materials")]
    public Material HullMaterial;
    public Material ThrusterMaterial;
    public Material LaserMaterial;

    [Header("Ownership")]
    public bool IsOwned; // Cached ownership flag; ideally validated via receipts/server
}