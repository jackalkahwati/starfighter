using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Central manager that stores available ship skins and applies the active skin to the player ship.
/// Keep this object alive across scenes.
/// </summary>
public class CosmeticsManager : MonoBehaviour
{
    public static CosmeticsManager Instance { get; private set; }

    [SerializeField] private ShipSkinSO defaultSkin;
    [SerializeField] private List<ShipSkinSO> allSkins = new List<ShipSkinSO>();

    public ShipSkinSO ActiveSkin { get; private set; }

    private const string PlayerPrefKey = "active_skin";

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
        // Restore last equipped skin or fallback to default
        var savedId = PlayerPrefs.GetString(PlayerPrefKey, defaultSkin ? defaultSkin.Id : string.Empty);
        ApplySkin(savedId);

        // Ensure future scene loads also apply the materials
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    private void OnDestroy()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        ApplyToPlayerShip();
    }

    public IEnumerable<ShipSkinSO> GetAllSkins() => allSkins;

    public void ApplySkin(string id)
    {
        var skin = allSkins.FirstOrDefault(s => s.Id == id);
        if (skin == null)
        {
            skin = defaultSkin;
        }

        if (skin == null)
        {
            Debug.LogWarning("CosmeticsManager: No skin available to apply");
            return;
        }

        ActiveSkin = skin;
        PlayerPrefs.SetString(PlayerPrefKey, skin.Id);

        ApplyToPlayerShip();
    }

    private void ApplyToPlayerShip()
    {
        var player = FindObjectOfType<PlayerShip>();
        if (!player) return;

        var renderer = player.Renderer; // Assumes PlayerShip exposes Renderer property
        if (!renderer) return;

        var mats = renderer.materials;

        if (ActiveSkin.HullMaterial)
            mats[0] = ActiveSkin.HullMaterial; // hull assumed index 0

        renderer.materials = mats;

        // Thruster and weapon recolouring delegated to their own components
        var weapon = player.GetComponent<PlayerWeapon>();
        if (weapon && ActiveSkin.LaserMaterial)
            weapon.SetLaserMaterial(ActiveSkin.LaserMaterial);

        var thruster = player.GetComponentInChildren<ThrusterController>();
        if (thruster && ActiveSkin.ThrusterMaterial)
            thruster.SetThrusterMaterial(ActiveSkin.ThrusterMaterial);
    }
} 