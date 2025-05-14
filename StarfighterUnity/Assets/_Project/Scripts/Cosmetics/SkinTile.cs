using UnityEngine;
using UnityEngine.UI;

public class SkinTile : MonoBehaviour
{
    [SerializeField] private RawImage thumbnail;
    [SerializeField] private Text nameText;
    [SerializeField] private Text priceText;
    [SerializeField] private Button actionButton;

    private ShipSkinSO skin;
    private System.Action<ShipSkinSO> onClicked;

    public void Init(ShipSkinSO skinSO, System.Action<ShipSkinSO> clickedCallback)
    {
        skin = skinSO;
        onClicked = clickedCallback;

        if (skin)
        {
            nameText.text = skin.DisplayName;
            priceText.text = skin.IsOwned ? "OWNED" : "$0.99"; // Static placeholder price
            actionButton.GetComponentInChildren<Text>().text = skin.IsOwned ? "EQUIP" : "BUY";
        }

        actionButton.onClick.RemoveAllListeners();
        actionButton.onClick.AddListener(() => onClicked?.Invoke(skin));
    }

    private void OnDestroy()
    {
        actionButton.onClick.RemoveAllListeners();
    }
} 