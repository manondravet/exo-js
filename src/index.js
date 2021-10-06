console.log("HelloWorld");

let cityNames = [];
let populationScores = [];

import Chart from 'chart.js/auto';


import { ApiClient, fromCatalog } from '@opendatasoft/api-client';

// Initialize the Client by indicating the domain to request.
const client = new ApiClient({ domain: "documentation-resources" });

// Create the query to run.
const query = fromCatalog() // From the domain catalog
    .dataset("doc-geonames-cities-5000") // ... we'll use the dataset "doc-geonames-cities-5000"
    .aggregates() // ... in order to make an aggregation.
    .where("country_code:'FR'") // // Filter records where country_code === "FR".
    .groupBy("name as city, population") // Select the fields "name" and "population".
    .orderBy("-population") // Sort by population in descending order.
    .limit(10) // But we only want the first 10 most populated cities.
    .toString(); // Then finally, we convert our query into a string.

// Now, run the query.
client.get(query)
    .then(res => {
        for (const dataObj of res.aggregations) {
            cityNames.push(dataObj.city)
            populationScores.push(parseInt(dataObj.population))
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cityNames,
                datasets: [{
                    label: 'Population des villes',
                    data: populationScores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    })
    .catch(error => console.error(error));