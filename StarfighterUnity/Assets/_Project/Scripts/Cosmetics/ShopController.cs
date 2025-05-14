using System.Collections.Generic;
using UnityEngine;

public class ShopController : MonoBehaviour
{
    [SerializeField] private Transform gridRoot;
    [SerializeField] private SkinTile tilePrefab;

    private readonly List<SkinTile> spawnedTiles = new();

    private void OnEnable()
    {
        BuildGrid();
    }

    private void OnDisable()
    {
        ClearGrid();
    }

    private void BuildGrid()
    {
        ClearGrid();
        foreach (var skin in CosmeticsManager.Instance.GetAllSkins())
        {
            var tile = Instantiate(tilePrefab, gridRoot);
            tile.Init(skin, OnTileClicked);
            spawnedTiles.Add(tile);
        }
    }

    private void ClearGrid()
    {
        foreach (var t in spawnedTiles)
        {
            if (t)
                Destroy(t.gameObject);
        }
        spawnedTiles.Clear();
    }

    private void OnTileClicked(ShipSkinSO skin)
    {
        if (skin.IsOwned)
        {
            CosmeticsManager.Instance.ApplySkin(skin.Id);
        }
        else
        {
            IAPManager.Instance.BuyProduct(skin.IAPId);
        }
    }
} 