package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

type Coords struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Location struct {
	Cep         string `json:"cep"`
	Logradouro  string `json:"logradouro"`
	Complemento string `json:"complemento"`
	Bairro      string `json:"bairro"`
	Localidade  string `json:"localidade"`
	Uf          string `json:"uf"`
	Ibge        string `json:"ibge"`
	Gia         string `json:"gia"`
	Ddd         string `json:"ddd"`
	Siafi       string `json:"siafi"`
	Numero      string `json:"numero"`
	Coords      Coords `json:"coords"`
}

func GetLocationDetails(address string) (*Location, error) {
	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")

	apiURL := "https://maps.googleapis.com/maps/api/geocode/json"
	reqURL := fmt.Sprintf("%s?address=%s&key=%s", apiURL, url.QueryEscape(address), apiKey)

	resp, err := http.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-200 response code: %d", resp.StatusCode)
	}

	var geocodeResponse struct {
		Results []struct {
			AddressComponents []struct {
				LongName  string   `json:"long_name"`
				ShortName string   `json:"short_name"`
				Types     []string `json:"types"`
			} `json:"address_components"`
			Geometry struct {
				Location struct {
					Lat float64 `json:"lat"`
					Lng float64 `json:"lng"`
				} `json:"location"`
			} `json:"geometry"`
			FormattedAddress string `json:"formatted_address"`
		} `json:"results"`
		Status string `json:"status"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&geocodeResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	if geocodeResponse.Status != "OK" {
		return nil, fmt.Errorf("geocoding API error: %s", geocodeResponse.Status)
	}

	// Extrair as informações do primeiro resultado
	result := geocodeResponse.Results[0]
	location := &Location{}

	for _, component := range result.AddressComponents {
		for _, t := range component.Types {
			switch t {
			case "postal_code":
				location.Cep = component.LongName
			case "route":
				location.Logradouro = component.LongName
			case "sublocality", "sublocality_level_1", "political":
				location.Bairro = component.LongName
			case "administrative_area_level_2":
				location.Localidade = component.LongName
			case "administrative_area_level_1":
				location.Uf = component.ShortName
			}
		}
	}

	// Coordenadas geográficas
	location.Coords.Latitude = result.Geometry.Location.Lat
	location.Coords.Longitude = result.Geometry.Location.Lng

	return location, nil
}
