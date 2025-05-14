using UnityEngine;

public class PlayerShip : MonoBehaviour
{
    [SerializeField] private Renderer shipRenderer;

    public Renderer Renderer => shipRenderer;

    private void Reset()
    {
        shipRenderer = GetComponentInChildren<Renderer>();
    }
} 