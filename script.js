let map;
let markers = [];
let chart;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });
}

async function fetchData() {
    try {
        const response = await fetch('https://api.covid19api.com/summary');
        const data = await response.json();
        const globalData = data.Global;
        const countriesData = data.Countries;

        totalCasesElement.textContent = globalData.TotalConfirmed.toLocaleString();
        totalRecoveredElement.textContent = globalData.TotalRecovered.toLocaleString();
        totalDeathsElement.textContent = globalData.TotalDeaths.toLocaleString();
    

        // Update map markers
        updateMarkers(countriesData);

        // Update chart
        updateChart(countriesData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateMarkers(countriesData) {
    // Remove existing markers
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];

    // Add new markers
    countriesData.forEach(country => {
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(country.CountryCode), lng: parseFloat(country.TotalConfirmed) },
            map: map,
            title: `${country.Country}: ${country.TotalConfirmed} cases`
        });

        // Add click event listener to show info window
        marker.addListener('click', function () {
            new google.maps.InfoWindow({
                content: `
                    <h3>${country.Country}</h3>
                    <p>Total Cases: ${country.TotalConfirmed}</p>
                    <p>Total Recovered: ${country.TotalRecovered}</p>
                    <p>Total Deaths: ${country.TotalDeaths}</p>
                `
            }).open(map, marker);
        });

        markers.push(marker);
    });
}

function updateChart(countriesData) {
    const ctx = document.getElementById('chart').getContext('2d');
    if (!chart) {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: countriesData.map(country => country.Country),
                datasets: [
                    {
                        label: 'Total Cases',
                        data: countriesData.map(country => country.TotalConfirmed),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Total Recovered',
                        data: countriesData.map(country => country.TotalRecovered),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Total Deaths',
                        data: countriesData.map(country => country.TotalDeaths),
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        chart.data.labels = countriesData.map(country => country.Country);
        chart.data.datasets[0].data = countriesData.map(country => country.TotalConfirmed);
        chart.data.datasets[1].data = countriesData.map(country => country.TotalRecovered);
        chart.data.datasets[2].data = countriesData.map(country => country.TotalDeaths);
        chart.update();
    }
}

function searchCountry() {
    const searchInput = document.getElementById('country-search').value.toLowerCase();
    const country = markers.find(marker => marker.title.toLowerCase().includes(searchInput));
    if (country) {
        map.setCenter(country.getPosition());
        map.setZoom(5);
        new google.maps.InfoWindow({
            content: country.title
        }).open(map, country);
    } else {
        alert('Country not found.');
    }
}

setInterval(fetchData, 60000); // Update data every minute
fetchData();




