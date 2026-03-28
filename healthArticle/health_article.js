var xhr = new XMLHttpRequest();
var url = './health_article.json';

// Open the GET request
xhr.open('GET', url, true);
xhr.responseType = 'json';

// Define what happens when the data is successfully loaded
xhr.onload = function() {
    // 1. Retrieve the articles array from the JSON response
    var articles = xhr.response.articles;
    
    // 2. Retrieve the HTML element where the fetched content will be displayed
    var articlesDiv = document.getElementById('articles');

    // 3. Loop through each article in the JSON array
    articles.forEach(function(article) {
        
        // Create the main div for the article and add a class
        var articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        
        // Create and populate the title
        var title = document.createElement('h2');
        title.textContent = article.title;
        
        // Create and populate the description
        var description = document.createElement('p');
        description.textContent = article.description;
        
        // Create the "Ways to Achieve" header and list
        var waysHeader = document.createElement('h3');
        waysHeader.textContent = 'Ways to Achieve:';
        var waysList = document.createElement('ul');
        
        // Loop through ways_to_achieve array and create list items
        article.ways_to_achieve.forEach(function(way) {
            var listItem = document.createElement('li');
            listItem.textContent = way;
            waysList.appendChild(listItem);
        });
        
        // Create the "Benefits" header and list
        var benefitsHeader = document.createElement('h3');
        benefitsHeader.textContent = 'Benefits:';
        var benefitsList = document.createElement('ul');
        
        // Loop through benefits array and create list items
        article.benefits.forEach(function(benefit) {
            var listItem = document.createElement('li');
            listItem.textContent = benefit;
            benefitsList.appendChild(listItem);
        });

        // Attach all dynamically created elements to the individual article div
        articleDiv.appendChild(title);
        articleDiv.appendChild(description);
        articleDiv.appendChild(waysHeader);
        articleDiv.appendChild(waysList);
        articleDiv.appendChild(benefitsHeader);
        articleDiv.appendChild(benefitsList);

        // Finally, attach the entire article div to the main container on the page
        articlesDiv.appendChild(articleDiv);
    });
};

// Send the request to fetch the data
xhr.send();