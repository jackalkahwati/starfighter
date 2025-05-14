using UnityEngine;

public class ThrusterController : MonoBehaviour
{
    [SerializeField] private ParticleSystem thrusterParticles;

    public void SetThrusterMaterial(Material mat)
    {
        if (thrusterParticles == null || mat == null) return;
        var main = thrusterParticles.main;
        var particleMat = thrusterParticles.GetComponent<ParticleSystemRenderer>().material;
        thrusterParticles.GetComponent<ParticleSystemRenderer>().material = mat;
    }

    private void Reset()
    {
        thrusterParticles = GetComponentInChildren<ParticleSystem>();
    }
} 