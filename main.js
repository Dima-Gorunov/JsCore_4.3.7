const searchInput = document.querySelector('#search');
const autocomplete = document.querySelector('#autocomplete');
const repositoryList = document.querySelector('#repositories');
const searchResults = document.getElementById('searchResults');
const selectedRepos = document.getElementById('selectRepos');
let timeoutId;

function getRepo(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            console.log(data.items);
            showSearchResults(data.items)
        })
        .catch(error => {
            console.log(error);
        })
}

function deleteLi(selectedLi) {
    selectedLi.remove()
}

function showSearchResults(repos) {
    // Очищаем выпадающее меню перед добавлением новых результатов
    searchResults.innerHTML = '';
    // Добавляем элементы li для каждого репозитория в списке
    repos.forEach((repo) => {
        const li = document.createElement('li');
        li.textContent = repo.name;
        // Добавляем обработчик клика на элемент списка
        li.addEventListener('click', () => {
            // Добавляем выбранный репозиторий в список выбранных
            const selectedLi = document.createElement('li');
            selectedLi.innerHTML = `
            <div style="position: relative; display: flex; justify-content: space-between; align-items: center">
                <div>
                    <div>Name: ${repo.name}</div>
                    <div>Owner: ${repo.owner.login}</div>
                    <div>Stars: ${repo.stargazers_count}</div>
                </div>
                <div class="cross" id="cross_button">               
                </div>
            </div>`
            selectedLi.querySelector('.cross').addEventListener('click',()=>{
                deleteLi(selectedLi);
            })
            // Очищаем поле ввода
            searchInput.value = '';
            selectedRepos.appendChild(selectedLi)
            // Очищаем выпадающее меню
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(li);
    });
}

function debounce(callback, wait) {
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(this, args);
        }, wait);
    };
}

function handleInput() {
    getRepo(searchInput.value)
}

searchInput.addEventListener('input', debounce(handleInput, 200));



