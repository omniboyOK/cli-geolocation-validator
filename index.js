require("colors");
const database = require("./driver/Connection");
const inquirer = require("inquirer");
const GeoController = require("./Controller/GeoController");

database.init(Init);

var savedPoint = null;

function Init() {
  let initialOptions = ["Obtener posicion de dirección"];
  if (savedPoint) {
    initialOptions.push("Validar Posicion en un país");
  }
  inquirer
    .prompt([
      {
        type: "list",
        message: "Que proceso debo correr?",
        name: "main",
        choices: initialOptions,
      },
    ])
    .then(async (answer) => {
      switch (answer.main) {
        case "Obtener posicion de dirección":
          inquirer
            .prompt([
              {
                name: "address",
                message: "Escribe una dirección\n",
                default: "",
              },
            ])
            .then(async function (answer) {
              let results = await GeoController.getGeo(answer.address);
              if (results.length > 0) {
                selectValidAddress(results);
              } else {
                console.log("No se obtuvo resultados\n".red);
                Init();
              }
            });
          return;
        case "Validar Posicion en un país":
          inquirer
            .prompt([
              {
                name: "country",
                message:
                  "Escribe un codigo de país para realizar la busqueda ARG\n",
                default: "ARG",
              },
            ])
            .then(async (answer) => {
              let result = await GeoController.validateInCountry(
                savedPoint,
                answer.country
              );
              if (result) {
                console.log("La direccion esta en el area de cobertura");
              }
            });
          break;
        default:
          console.log("Volviendo al menu principal");
          return Init();
      }
    });
}

function selectValidAddress(list) {
  let options = [];

  list.forEach((address) => {
    options.push(address.display_name);
  });

  inquirer
    .prompt([
      {
        type: "list",
        message: "Elige una direccion entre los resultados",
        name: "choice",
        choices: options,
      },
    ])
    .then(async (answer) => {
      let current = {};
      list.forEach((address) => {
        if (address.display_name === answer.choice) {
          current = { lat: address.lat, lon: address.lon };
        }
      });
      inquirer
        .prompt([
          {
            name: "country",
            message:
              "Escribe un codigo de país para realizar la busqueda ARG\n",
            default: "ARG",
          },
        ])
        .then(async (answer) => {
          let result = await GeoController.validateInCountry(
            current,
            answer.country
          );
          if (result === true) {
            console.log("La direccion esta en el area de cobertura".green);
          } else {
            console.log("La direccion esta fuera del area de cobertura".red);
          }
          Init();
        });
    });
}
