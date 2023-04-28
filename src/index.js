async function fetchDogs() {
    let res = await fetch('http://localhost:3000/pups')
    let json = await res.json()
    // console.log(json)
    json.forEach(obj => buildBar(obj))
}
fetchDogs()

function buildBar(obj) {
    let span = document.createElement('span')
    span.textContent = obj.name
    span.style.textAlign = "center"
    span.style.cursor = 'pointer'
    document.getElementById('dog-bar').appendChild(span)
    showDog(obj.id, span)
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function showDog(dogId, span) {
    span.addEventListener('click', async () => {
        const res = await fetch(`http://localhost:3000/pups/${dogId}`)
        obj = await res.json()
        removeAllChildNodes(document.getElementById('dog-info'))
        let img = document.createElement('img')
        img.src = obj.image
        let name = document.createElement('h2')
        name.textContent = obj.name
        let btn = document.createElement('button')
        if (!obj.isGoodDog) {
            btn.textContent = "Good Dog!"
        } else {
            btn.textContent = "Bad Dog!"
        }
        goodBadToggle(btn, obj)
        document.getElementById('dog-info').appendChild(img)
        document.getElementById('dog-info').appendChild(name)
        document.getElementById('dog-info').appendChild(btn)
    })
}

function goodBadToggle(btn, obj) {
    btn.addEventListener('click', e => {
        const goodDog = btn.textContent === "Good Dog!"
        if (goodDog) {
            e.target.textContent = "Bad Dog!"
        } else {
            e.target.textContent = "Good Dog!"
        }
        dogPatcher(obj, goodDog)
    })
}

async function dogPatcher(obj, goodDog) {
    // console.log(obj)
    let res = await fetch(`http://localhost:3000/pups/${obj.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            isGoodDog: goodDog
        })
    })
    let json = await res.json()
    // console.log(obj)
    // console.log(json)
}

let filterBtn = document.getElementById('good-dog-filter')
filterBtn.addEventListener('click', async () => {
    const res = await fetch('http://localhost:3000/pups')
    const json = await res.json()
    let goodDogsArr = json.filter(dog => dog.isGoodDog === true)
    removeAllChildNodes(document.getElementById('dog-bar'))
    const goodFilter = filterBtn.textContent === 'Filter good dogs: OFF'
    if (goodFilter) {
        goodDogsArr.forEach(goodDog => {
            buildBar(goodDog)
        })
        filterBtn.textContent = "Filter good dogs: ON"
    } else {
        json.forEach(dog => buildBar(dog))
        filterBtn.textContent = "Filter good dogs: OFF"
    }
})