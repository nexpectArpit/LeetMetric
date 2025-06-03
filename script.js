document.addEventListener("DOMContentLoaded",function(){//"DOMContentLoaded" event fires when the initial HTML document has been completely loaded and parsed
    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");

    const statsContainer=document.getElementsByClassName("stats-container");
    const easyProgressCircle=document.getElementsByClassName("easy-progress")
    const mediumProgressCircle=document.getElementsByClassName("medium-progress")
    const hardProgressCircle=document.getElementsByClassName("hard-progress")
    const easyLabel=document.getElementById("easy-label")
    const mediumLabel=document.getElementById("medium-label")
    const hardLabel=document.getElementById("hard-label")
    const cardStatsContainer=document.getElementsByClassName("stats-card")
    const resetIcon=document.getElementById('reset-icon');

    resetIcon.addEventListener('click', () => {//for reset button
        usernameInput.value = '';
        easyLabel.textContent = '';
        mediumLabel.textContent = '';
        hardLabel.textContent = '';
    
        // Reset progress circles
        easyProgressCircle[0].style.setProperty("--progress-degree", `0%`);
        easyProgressCircle[0].style.setProperty("--circle-color", `#1CBBBA`);
        easyProgressCircle[0].style.setProperty("--circle-bg-color", `#2C4645`);
      
        mediumProgressCircle[0].style.setProperty("--progress-degree", `0%`);
        mediumProgressCircle[0].style.setProperty("--circle-color", `#FFB700`);
        mediumProgressCircle[0].style.setProperty("--circle-bg-color", `#534429`);
      
        hardProgressCircle[0].style.setProperty("--progress-degree", `0%`);
        hardProgressCircle[0].style.setProperty("--circle-color", `#F53837`);
        hardProgressCircle[0].style.setProperty("--circle-bg-color", `#522D2C`);
        
        Array.from(cardStatsContainer).forEach(container => {
            container.innerHTML = '';
        });
    });

    //below fn. is for validating username
    // function validateUsername(username){//return true or false based on regex
    //     if(username.trim()===""){
    //         alert("Username should not be empty")
    //         return false;
    //     }
    //     const regex=/^[a-zA-Z0-9_]{3,16}$/;
    //     const isMatching=regex.test(username);
    //     if(!isMatching){
    //         alert("invalid username");
    //     }
    //     return isMatching;
    // }
    function validateUsername(username) {
        if (username.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username should not be empty 😎',
                confirmButtonText: 'Got it'
            });
            return false;
        }
        // Regex for allowed usernames (3 to 16 chars, letters, numbers, underscores)
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        const isMatching = regex.test(username);
    
        if (!isMatching) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Username',
                text: 'Username must be 3-16 characters long and can only include letters, numbers, and underscores.',
                confirmButtonText: 'Try Again'
            });
            return false;
        }
        return true;
    }    

    async function fetchUserDetails(username){//api call ka fn.
        
        try{
            searchButton.textContent="searching...";
            searchButton.disabled=true;

            ////below code if our api didn't work,then we gonna use graphql api, then do filtering from it
            // const proxyUrl=`https://cors-anywhere.herokuapp.com/corsdemo`//to prevent cors error
            // const targetUrl=`https://leetcode.com/graphql/`
            
            // //concatented url->proxyUrl+targetUrl
            // const myHeaders=new Headers();
            // myHeaders.append("content-type","application/json");
            //foloowing query to tell what data we need from api
            // const graphql = JSON.stringify({
            //     query: "\n    query userSessionProgress($username: String!) {\n      allQuestionsCount {\n        difficulty\n        count\n      }\n      matchedUser(username: $username) {\n        submitStats {\n          acSubmissionNum {\n            difficulty\n            count\n          }\n          totalSubmissionNum {\n            difficulty\n            count\n            submissions\n          }\n        }\n      }\n    }\n  ",
            //     variables: { "username": `${username}` }
            // });

            // const requestOptions = {
            //   method: "POST",
            //   headers: myHeaders,
            //   body: graphql
            // };
            //we use proxy server to prevent cors error
            // const response=await fetch(proxyUrl+targetUrl,requestOptions);

            const URL=`https://leetcode-stats-api.herokuapp.com/${username}`;
            const response=await fetch(URL);
                if(!response.ok){
                     throw new Error("Unable to fetch the user details");
                }
            const parsedData=await response.json();
            console.log("logging data: ",parsedData);
            displayUserData(parsedData);//fn. to show our fetched data to our ui           
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data found</p>`;
            console.error("Error:", error.message);
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }
    function updateProgress(solved,total,label,circle){//fn. to calculate percentage
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;

        
    }
    function displayUserData(parsedData){//fn. to get get wanted data
        ////below data if we use graphql api
        // const totalQ=parsedData.data.allQuestionsCount[0].count;
        // const totalEasyQ=parsedData.data.allQuestionsCount[1].count;
        // const totalMediumQ=parsedData.data.allQuestionsCount[2].count;
        // const totalHardQ=parsedData.data.allQuestionsCount[3].count;

        // const solvedTotalQ=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        // const solvedTotalEasyQ=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        // const solvedTotalMediumQ=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        // const solvedTotalHardQ=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
        
        const totalEasyQ = parsedData.totalEasy;
        const totalMediumQ = parsedData.totalMedium;
        const totalHardQ = parsedData.totalHard;

        const solvedTotalEasyQ = parsedData.easySolved;
        const solvedTotalMediumQ = parsedData.mediumSolved;
        const solvedTotalHardQ = parsedData.hardSolved;

        updateProgress(solvedTotalEasyQ,totalEasyQ,easyLabel,easyProgressCircle[0]);
        updateProgress(solvedTotalMediumQ,totalMediumQ,mediumLabel,mediumProgressCircle[0]);
        updateProgress(solvedTotalHardQ,totalHardQ,hardLabel,hardProgressCircle[0])

        const cardData=[
            ////below data if we use graphql api
            // {label:"Overall Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            // {label:"Overall  Easy Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            // {label:"Overall Medium Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            // {label:"Overall Hard Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
            
            { label: "Total Questions Solved", value: parsedData.totalSolved },
            { label: "Ranking", value: parsedData.ranking },
            { label: "Contribution Points", value: parsedData.contributionPoints },
            { label: "Reputation", value: parsedData.reputation },
        ];
        //console.log(cardData)
        cardStatsContainer[0].innerHTML=cardData.map(data=>{
                return `
                <div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>
                `;
            }).join('');
    }
    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        if(validateUsername(username)){
              fetchUserDetails(username);
        }
        
    })


})