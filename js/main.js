/** Get the the hamburger element */
const hamburger = document.getElementById("bars")
/** Create event listenenr to toggle submenu view for mobile view */
hamburger.onclick = () => {
    const submenu = document.getElementById("submenu")
    submenu.classList.toggle("show")
}

/**
 * @name {formatDate}
 * @param {Date} date 
 * @returns date string in format e.g  July 16
 */
const formatDate = (date) => {
    let format = new Date(date).toDateString().split(" ")
    return `${format[1]} ${format[2]}`
}


/**Graphql Query Init*/
const API_URL = "https://api.github.com/graphql"
const BEARER_TOKEN = "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"

/**
 * @name{USER GITHUB PROFILE INFORMATION}
 * Getting the elements by their className retrieves all occurence/appearances of the
 * below data @param{github_name, nickname, github_bio}.
 * This reduces SPACE COMPLEXITY by not having to assign each occurence
 * to a separate variable.
 */
const github_name = document.getElementsByClassName("github_name")
const nickname = document.getElementsByClassName("nickname")
const github_bio = document.getElementsByClassName("bio")
const github_avatar = document.getElementsByClassName("img_url")
const repositoryCount = document.getElementsByClassName("repo-count")



/** UI Components*/
const githubIcon = document.getElementById("git-icon")
const errorComponent = document.getElementById("error-container")
const tryAgainBtn = document.getElementById("try-again-btn")
const formContainer = document.getElementById("form-container")
const repositoryCardContainer = document.getElementById("repo-card-container")
const profilePageComponent = document.getElementById("git")
const username = document.getElementById("username") //input field element - ref(line 31 index.html)
const form = document.getElementById("submit-form") //form element - ref(line 28-34 index.html)
const loader = document.getElementById("loader") //element that displays a lazy load state on the DOM -ref(line 16-18 index.html)

//Reloads page.
githubIcon.onclick = (e) => {
    e.preventDefault()
    window.location.reload()
}
//Retry request
tryAgainBtn.onclick = (e) => {
    e.preventDefault()
    window.location.reload()
}


/** Handles the form submission event */
form.onsubmit = (e) => {
    e.preventDefault()
    form.style.display = "none"
    loader.style.display = "block"
    /** Make call to API endpoint */
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify({
            query: `
                {
                user(login: "${username.value}") {
                    name
                    bio
                    login
                    avatarUrl
                    repositories(last: 20, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: ASC}) {
                    nodes {
                        primaryLanguage {
                        name
                        color
                    }
                        updatedAt
                        stargazerCount
                        name
                        forkCount
                        description
                    }
                    }
                }
                }
                `
        })
    }).then((res) => res.json()).then(data => {
        const { user } = data.data
        const { name, bio, avatarUrl, repositories, login } = user
        const { nodes } = repositories
        document.getElementById("result-count").textContent = nodes.length
        nodes.map(repository => {
            repositoryCardContainer.innerHTML += `
            <div class="repo-card">
                <div class="repo-desc">
                    <h3>${repository?.name}</h3>
                    <p>${repository?.description ?? ""}</p>
                    <div class="repo-lang">
                        <div class="wrapper">
                            <div class="lang-color" style="background-color:${repository.primaryLanguage?.color}"></div>
                            &nbsp;
                            <div class="lang">${repository.primaryLanguage?.name ?? ""}</div>
                        </div>
                        <div class="lang"><i class="far fa-star"></i> ${repository?.stargazerCount}</div>
                        <div class="lang"><i class="fas fa-code-branch"></i> ${repository?.forkCount}</div>
                        <div class="lang">Updated on ${formatDate(repository?.updatedAt)}</div>
                    </div>
                </div>
                <div class="repo-star">
                    <button class="btn-star"><i class="far fa-star"></i> Star</button>
                </div>
            </div>
            `
        })

        /** Hide the lazy load UI component on successfull data fetch */
        formContainer.style.display = "none"
        profilePageComponent.style.display = "block"

        /** Optimized loop to make TIME COMPLEXITY O(n) by
         * not iterating through each user info objects separately
         * ref - (line 21-24 main.js)
         */
        for(let i=0; i < github_avatar.length; i++){
            github_avatar[i].src = avatarUrl
            github_name[i].textContent = name
            github_bio[i].textContent = bio
            nickname[i].textContent = login
            repositoryCount[i].textContent = nodes.length
        }


    }).catch(err => {
        /** Render fallback UI on ERROR */
        errorComponent.style.display = "flex"
        form.style.display = "none"
        loader.style.display = "none"
    })
}
