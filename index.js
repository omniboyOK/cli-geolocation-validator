require("colors");
const database = require("./driver/Connection");
const inquirer = require("inquirer");
const GeoController = require("./Controller/GeoController");

database.init(Init);

var savedPoint = null;

function Init() {
  let initialOptions = ["Get address geolocation"];
  if (savedPoint) {
    initialOptions.push("Validate point in country");
  }
  inquirer
    .prompt([
      {
        type: "list",
        message: "What should I do?",
        name: "main",
        choices: initialOptions,
      },
    ])
    .then(async (answer) => {
      switch (answer.main) {
        case "Get address geolocation":
          inquirer
            .prompt([
              {
                name: "address",
                message: "Write an address\n",
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
        case "Validate point in country":
          inquirer
            .prompt([
              {
                name: "country",
                message:
                  "Input a country code in ISO3 to validate ex: ARG\n",
                default: "ARG",
              },
            ])
            .then(async (answer) => {
              let result = await GeoController.validateInCountry(
                savedPoint,
                answer.country
              );
              if (result) {
                console.log("Addres is inside of country bounds".green);
              }
            });
          break;
        default:
          console.log("Going back to home menu");
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
        message: "Choose the address that fit your search",
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
              "Input a country code in ISO3 to validate ex: ARG\n",
            default: "ARG",
          },
        ])
        .then(async (answer) => {
          let result = await GeoController.validateInCountry(
            current,
            answer.country
          );
          if (result === true) {
            console.log("Addres is inside of country bounds".green);
          } else {
            console.log("Addres is outside of country bounds".red);
          }
          Init();
        });
    });
}
