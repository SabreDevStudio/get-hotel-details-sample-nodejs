const config = require('./config');
const searchCriteria = require('./searchCriteria');

const AuthenticationModel = require('./authenticationModel');
const HotelDetailsModel = require('./hotelDetailsModel');
const HotelAvailView = require('./hotelDetailsView');

let authentication;

function SearchForHotels() {
  const hotelDetailsModel = new HotelDetailsModel({
    searchCriteria,
    apiAccessToken: authentication.token,
    appId: config.appId,
    apiEndPoint: config.apiEndPoint,
  });

  hotelDetailsModel.read()
    .then(() => {
      const hotelSearchView = new HotelAvailView({
        hotelDetailsModel,
        searchCriteria,
      });
      hotelSearchView.render();
    })
    .catch(() => {
      console.log('\n');
    });
}

console.log('\n   Running the Get Hotel Details V1 demo\n\n');

authentication = new AuthenticationModel({
  apiEndPoint: config.apiEndPoint,
  userSecret: config.userSecret,
});

authentication.createToken()
  .then(() => {
    SearchForHotels();
  })
  .catch(() => {
    console.log('\n');
  });
