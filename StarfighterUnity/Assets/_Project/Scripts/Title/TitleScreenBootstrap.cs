using UnityEngine;

/// <summary>
/// Simple bootstrap for title scene. Spawns the player ship prefab, sets Cosmetics, and rotates camera around it.
/// </summary>
public class TitleScreenBootstrap : MonoBehaviour
{
    [Header("Scene References")]
    [SerializeField] private Transform spawnPoint;
    [SerializeField] private GameObject playerShipPrefab;
    [SerializeField] private Camera sceneCamera;
    [SerializeField] private float cameraOrbitRadius = 10f;
    [SerializeField] private float orbitSpeed = 10f;

    private Transform _cameraPivot;

    private void Start()
    {
        if (!playerShipPrefab)
        {
            Debug.LogError("TitleScreenBootstrap: PlayerShip prefab not assigned");
            return;
        }

        var spawnPos = spawnPoint ? spawnPoint.position : Vector3.zero;
        var ship = Instantiate(playerShipPrefab, spawnPos, Quaternion.identity);

        // Force cosmetics application
        CosmeticsManager.Instance.ApplyToPlayerShip();

        // Create pivot for camera orbit
        _cameraPivot = new GameObject("CameraPivot").transform;
        _cameraPivot.position = ship.transform.position;
        sceneCamera.transform.SetParent(_cameraPivot);
        sceneCamera.transform.localPosition = new Vector3(0, 2, -cameraOrbitRadius);
        sceneCamera.transform.LookAt(_cameraPivot);
    }

    private void Update()
    {
        if (_cameraPivot)
        {
            _cameraPivot.Rotate(Vector3.up, orbitSpeed * Time.deltaTime, Space.World);
        }
    }
} 