module.exports = {
  getCountry: function (country) {},
  saveCountry: function (country) {
      Connection.db.collection('countries').save(country, function(err, result){
          if(err){
              console.error(err);
              return;
          }
          console.log(`%c El país ${country.properties.ADMIN} se guardo correctamente`, 'color: green')
      });
  },
  checkCountry: function (country) {},
};
