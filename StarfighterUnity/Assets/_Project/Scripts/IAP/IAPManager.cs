using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Purchasing;

public class IAPManager : MonoBehaviour, IStoreListener
{
    public static IAPManager Instance { get; private set; }

    private IStoreController storeController;
    private IExtensionProvider storeExtensionProvider;

    [SerializeField]
    private List<string> productIds = new();

    private void Awake()
    {
        if (Instance && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        if (storeController == null)
        {
            InitializePurchasing();
        }
    }

    private void InitializePurchasing()
    {
        var builder = ConfigurationBuilder.Instance(StandardPurchasingModule.Instance());

        foreach (var id in productIds)
        {
            builder.AddProduct(id, ProductType.NonConsumable);
        }

        UnityPurchasing.Initialize(this, builder);
    }

    public void BuyProduct(string productId)
    {
        if (storeController == null) return;

        Product product = storeController.products.WithID(productId);
        if (product != null && product.availableToPurchase)
        {
            storeController.InitiatePurchase(product);
        }
        else
        {
            Debug.LogWarning($"IAPManager: Product {productId} is not available to purchase.");
        }
    }

    #region IStoreListener Implementation

    public void OnInitialized(IStoreController controller, IExtensionProvider extensions)
    {
        storeController = controller;
        storeExtensionProvider = extensions;
    }

    public void OnInitializeFailed(InitializationFailureReason error)
    {
        Debug.LogError("IAPManager: Initialization Failed: " + error);
    }

#if UNITY_2023_1_OR_NEWER
    public void OnInitializeFailed(InitializationFailureReason error, string message)
    {
        Debug.LogError($"IAPManager: Initialization Failed: {error} - {message}");
    }
#endif

    public PurchaseProcessingResult ProcessPurchase(PurchaseEventArgs args)
    {
        Debug.Log($"IAPManager: Purchase successful -> {args.purchasedProduct.definition.id}");

        var skin = CosmeticsManager.Instance.GetAllSkins().FirstOrDefault(s => s.IAPId == args.purchasedProduct.definition.id);
        if (skin != null)
        {
            skin.IsOwned = true;
#if ADDRESSABLES
            // Download skin assets first if they exist in a remote pack
            CosmeticsManager.Instance.StartCoroutine(
                SkinPackDownloader.DownloadAndApply(skin, () => CosmeticsManager.Instance.ApplySkin(skin.Id)));
#else
            CosmeticsManager.Instance.ApplySkin(skin.Id);
#endif
        }

        return PurchaseProcessingResult.Complete;
    }

    public void OnPurchaseFailed(Product product, PurchaseFailureReason failureReason)
    {
        Debug.LogWarning($"IAPManager: Purchase failed for {product.definition.id} - {failureReason}");
    }

    #endregion
} 