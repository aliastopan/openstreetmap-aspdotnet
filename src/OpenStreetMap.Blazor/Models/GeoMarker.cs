namespace OpenStreetMap.Blazor.Models;

public class GeoMarker
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Title { get; set; }

    public GeoMarker(double lat, double lng, string? title = null)
    {
        Latitude = lat;
        Longitude = lng;
        Title = title;
    }
}
