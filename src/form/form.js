import "./form.scss";
import "../assets/styles/styles.scss";
import { openModal } from "../assets/javascripts/modal";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const btnCancel = document.querySelector(".btn-secondary");
let articleId;
let errors =[];

const fillForm = (article) => {

  const author = document.querySelector("input[name='author']");
  const img = document.querySelector("input[name='img']");
  const category = document.querySelector("input[name='category']");
  const title = document.querySelector("input[name='title']");
  const content = document.querySelector("textarea");
  // si ces attributs n'ont pas de valeur on va leur donner une cc vide
  author.value = article.author || "";
  img.value = article.img || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");
  if (articleId) {
  const response = await fetch(`https://restapi.fr/api/articles/${articleId}`);
    if (response.status < 299) {
      const article = await response.json();
      fillForm(article);
    }
  }
};

initForm();


btnCancel.addEventListener("click",async () => {
  const result = await openModal ("Si vous quittez la page, vous allez perdre votre article");
  if(result) {
    location.assign("/index.html");
  }
  
});

form.addEventListener("submit",  async event =>{
    event.preventDefault();
    const formData = new FormData(form);
    const article = Object.fromEntries(formData.entries());
    if (formIsValid(article)) {
        try {
            const json = JSON.stringify(article);
            let response;
            if (articleId) {
                response = await fetch(`https://restapi.fr/api/articles/${articleId}`, {
                method: "PATCH",
                body: json,
                headers: {
                  "Content-Type": "application/json"
                       }
                });
            }
            else {

                response = await fetch("https://restapi.fr/api/articles", {
                method: "POST",
                body: json,
                headers: {
                  "Content-Type": "application/json"
                     }
                });
              }  
            if(response.status < 299) {
              location.assign("/index.html");//redirection: prend la base de localhost + /index.html
            }   

        } catch(e) {
            console.error('e: ', e);
        }
    }
});

const formIsValid = article => {
  errors = []; // eviter les doublons de duplication des champs
    if (
        !article.author ||
        !article.category||
        !article.content||
        !article.img||
        !article.title
    ) {
        errors.push("Vous devez renseigner tous les champs");
      }
    else if (article.content.length < 20) {
        errors.push("Le contenu de votre article est court");
      } 
    else
      {
          errors = [];
      }  

    if(errors.length) {
        let errorHTML = "";
        errors.forEach(e => {
            errorHTML += `<li>${e}</li>`;
          });
    
        errorElement.innerHTML = errorHTML;
        return false;
      } else {
        errorElement.innerHTML = "";
        return true;
      }

};