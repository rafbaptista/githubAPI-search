var container = document.querySelector(".container");
var search = document.querySelector(".btnSearch");
var loginToSearch;

search.addEventListener('click',function(){    
    var url = "https://api.github.com/users/"; //endpoint to get infos about specific user
    loginToSearch = document.querySelector(".inputText").value;
    url += loginToSearch;          
    makeRequest(url, true);
});


function makeRequest(url, updateValuesOnScreen) {        
    fetch(url)             
        .then(
            function(response) {
                if (response.status == 404) {                    
                    console.log("User not found, code "+response.status);
                    alert("User not found");                    
                    return;
                }

                if (response.status == 403) {                                        
                    console.log("API rate limit exceeded, code " + response.status);
                    alert("API rate limit exceeded, forbidden access");
                    return;
                }
                
                response.json().then(function(data){                    

                    if (updateValuesOnScreen) {
                        displayData(data);     
                    } else {
                        displayRepositories(data);
                    }      

                    if (data.public_repos > 0) {
                        makeRequest("https://api.github.com/users/"+loginToSearch+"/repos", false);
                    }                                        
                });
            }
        )
        .catch(function(error){
            console.log(error);
        })            
};

function displayData(data) {
    
    var categories = {
        id : "id",
        login : "login",
        created: "created_at",
        updated: "updated_at",
        following: "following",
        followers: "followers",
        repositories: "public_repos",
        location: "location",
        blog: "blog",
        email: "email",
        bio: "bio",
        avatar: "avatar_url"
    };            

    var categoriesEntries = Object.entries(categories);    

    //loop trough the categories returned by github API and display on the screen
    for (const [className, propName] of categoriesEntries) {
        var classNameTag = "."+className + "Info";                
        if (className == "avatar") {
            document.querySelector(classNameTag).src = data[propName];
        } else if (className == "created" || className == "updated") {
            document.querySelector(classNameTag).innerHTML = data[propName].substring(0,10);            
        } else {
            document.querySelector(classNameTag).innerHTML = data[propName] == null ? "not informed" : data[propName];            
        }                
      }
};

//remove searched repositories from other users
function removeOldRepositories() {
    var oldRepositories = document.querySelectorAll(".sectionRepositories .col-5");    
    for (var i = 0; i < oldRepositories.length; i++) {        
        oldRepositories[i].remove();
    }    
};

function displayRepositories(data) {           
    removeOldRepositories();

    for (var i = 0; i < data.length; i++) {

        //creates the main div and it's styles
        var div = document.createElement("div");
        div.classList.add("col-5", "mx-3", "my-2");
        div.style.border = "1px solid #ccc";
    
        //creates the <p> tag containing the repository name
        var pDiv = document.createElement("p");
        pDiv.style.color = "blue";
    
        var pDivText = document.createTextNode(data[i].name);            
        pDiv.appendChild(pDivText);
        div.appendChild(pDiv);
        
        //contains a green circle and a span with the repository language
        var borderLanguage = document.createElement("div");
        borderLanguage.classList.add("d-inline-block", "mr-1");
        borderLanguage.style.background = "#178600";
        borderLanguage.style.borderRadius = "50%";
        borderLanguage.style.width = "10px";
        borderLanguage.style.height = "10px";    
        div.appendChild(borderLanguage);
    
        var spanLanguage = document.createElement("span");
        var spanLanguageText = document.createTextNode(data[i].language || "not informed");        
        spanLanguage.appendChild(spanLanguageText);
        div.appendChild(spanLanguage);

        //contains the <p> tag informing when the repository was created
        var spanCreatedAt = document.createElement("p");
        var spanCreatedAtText = document.createTextNode("Created at: " + data[i].created_at.substring(0,10));
        spanCreatedAt.appendChild(spanCreatedAtText);
        div.appendChild(spanCreatedAt);
                        
        //append the div to the page, so it can be displayed
        document.querySelector(".sectionRepositories").appendChild(div);  
    }


    
};