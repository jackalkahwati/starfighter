using UnityEngine;

public class PlayerWeapon : MonoBehaviour
{
    [SerializeField] private Renderer laserRenderer; // Example reference to laser beam or gun muzzle

    public void SetLaserMaterial(Material mat)
    {
        if (!laserRenderer || !mat) return;
        laserRenderer.material = mat;
    }

    private void Reset()
    {
        laserRenderer = GetComponentInChildren<Renderer>();
    }
} 