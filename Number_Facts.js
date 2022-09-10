const body = document.querySelector("body");
const numForm = document.querySelector(".numForm");

async function getFacts(num) {
  try {
    let { data: res } = await axios.get(`http://numbersapi.com/${num}?json`);
    return res;
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

function addFact(fact) {
  let newP = document.createElement("p");
  newP.innerText = fact;
  body.append(newP);
}

numForm.addEventListener("submit", function (event) {
  event.preventDefault();
  num = document.querySelector("input").value;
  getFacts(num)
    .then((res) => {
      if (res.text) {
        addFact(res.text);
      } else {
        for (let fact in res) {
          addFact(res[fact]);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

async function numberFacts() {
  try {
    let res = await axios.get(`http://numbersapi.com/4?json`);
    console.log(res.data.text);

    let multipleRes = await axios.get(`http://numbersapi.com/1..5?json`);
    for (let fact in multipleRes.data) {
      addFact(multipleRes.data[fact]);
    }

    let resList = [];
    for (let i = 0; i < 4; i++) {
      resList.push(axios.get(`http://numbersapi.com/4?json`));
    }
    let parallelRes = await Promise.all(resList);

    for (let i = 0; i < parallelRes.length; i++) {
      addFact(parallelRes[i].data.text);
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

numberFacts();
