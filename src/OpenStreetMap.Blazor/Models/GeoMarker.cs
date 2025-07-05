namespace OpenStreetMap.Blazor.Models;

public class GeoMarker
{
    public Guid MarkerId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Title { get; set; }

    public GeoMarker() { }

    public GeoMarker(double lat, double lng, string? title = null)
    {
        MarkerId = Guid.CreateVersion7();
        Latitude = lat;
        Longitude = lng;
        Title = title;
    }
}
