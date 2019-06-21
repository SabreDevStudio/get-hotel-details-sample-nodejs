const leftColWidth = 35;

class HotelDetailsView {
  constructor(params) {
    this.hotelDetailsModel = params.hotelDetailsModel;
    this.searchCriteria = params.searchCriteria;
  }

  static getContentSourceById(id) {
    const sources = {
      100: 'Sabre GDS',
      110: 'Expedia Partner Solutions',
      112: 'Bedsonline',
      113: 'Booking.com',
    };

    return sources[id];
  }

  static formatCurrency(code, amount) {
    const currencyFormat = {
      style: 'currency',
      currency: code,
    };

    return amount.toLocaleString('en', currencyFormat);
  }

  static renderSeparator() {
    console.log('\t\t ------------------------');
  }

  renderSearchCriteria() {
    console.log(`\t\t >> Hotel Code ${this.searchCriteria.hotelCode} <<`);
    console.log(`\t\t  ${this.searchCriteria.date.checkIn} | ${this.searchCriteria.date.checkOut} \n`);
  }

  renderNameAndRating() {
    const hotelNameRank = this.hotelDetailsModel.results.HotelInfo;
    const name = hotelNameRank.HotelName || '';
    const rating = hotelNameRank.SabreRating || '';

    console.log(`  ${name.padEnd(leftColWidth)} ${rating} ⭐️`);
  }

  renderLocationAndContact() {
    const description = this.hotelDetailsModel.results.HotelDescriptiveInfo;
    const location = description.LocationInfo;
    const addressSet = location.Address;
    const address = addressSet.AddressLine1 || '';
    const citySet = addressSet.CityName || {};
    const cityName = citySet.value || '';
    const stateSet = addressSet.StateProv || {};
    const stateCode = stateSet.StateCode || '';
    const postalCode = addressSet.PostalCode || '';
    const contact = location.Contact || {};
    const phone = contact.Phone || 'N/A';
    const cityStateZip = `${cityName}, ${stateCode} ${postalCode}`;

    console.log(`  ${address.padEnd(leftColWidth)} ${phone}`);
    console.log(`  ${cityStateZip.padEnd(leftColWidth, ' ')} (${location.Latitude}, ${location.Longitude})`);
  }

  formatAmenities() {
    const hotel = this.hotelDetailsModel.results;
    if (!hotel.HotelDescriptiveInfo || !hotel.HotelDescriptiveInfo.Amenities) {
      return '';
    }

    const amenities = hotel.HotelDescriptiveInfo.Amenities.Amenity;
    const count = amenities.length;

    return `${count} amenities`;
  }

  formatDescriptions() {
    const hotel = this.hotelDetailsModel.results;
    if (!hotel.HotelDescriptiveInfo || !hotel.HotelDescriptiveInfo.Descriptions) {
      return '';
    }

    const descriptions = hotel.HotelDescriptiveInfo.Descriptions.Description;
    const count = descriptions.length;

    return `${count} descriptions`;
  }

  renderAmenityAndDescriptionStatistics() {
    const amenityLabel = this.formatAmenities();
    const descriptionLabel = this.formatDescriptions();

    console.log(`  This property has ${amenityLabel} and ${descriptionLabel}`);
  }

  static renderPlanName(room) {
    console.log(`      Room: ${room.RatePlanName}`);
  }

  static formatPlanTotalPrice(room) {
    const rateInfo = room.RateInfo;
    const currencyCode = rateInfo.CurrencyCode || 'USD';
    const amountAfterTax = rateInfo.AmountAfterTax;
    const amountAfterTaxLabel = HotelDetailsView.formatCurrency(currencyCode, amountAfterTax);

    const average = rateInfo.AverageNightlyRate;
    const averageLabel = HotelDetailsView.formatCurrency(currencyCode, average);

    return `Total: ${amountAfterTaxLabel} | Average Nightly: ${averageLabel}`;
  }

  static renderPlanTotalPriceWithCommission(room) {
    const totalPriceLabel = HotelDetailsView.formatPlanTotalPrice(room);

    console.log(`      ${totalPriceLabel.padEnd(50)}`);
  }

  static renderPlanSource(room) {
    console.log(`      Source: ${HotelDetailsView.getContentSourceById(room.RateSource)} ℹ️`);
  }

  static renderPlanPricePerNight(room) {
    const rateInfo = room.RateInfo;
    const nightlyRatesSet = rateInfo.Rates || {};
    const nightlyRates = nightlyRatesSet.Rate;

    if (!nightlyRates) return;

    nightlyRates.forEach((rate, index) => {
      const amountAfterTax = rate.AmountAfterTax || 0;
      const amountBeforeTax = rate.AmountBeforeTax || 0;
      const amount = amountAfterTax || amountBeforeTax;
      const currencyCode = rate.CurrencyCode || 'USD';
      const amountLabel = HotelDetailsView.formatCurrency(currencyCode, amount);

      console.log(`         Night #${index + 1} - ${rate.StartDate} to ${rate.EndDate} - Rate: ${amountLabel}`);
    });
  }

  renderRoomRates() {
    const hotel = this.hotelDetailsModel.results;
    const rooms = hotel.HotelRateInfo.Rooms.Room;

    rooms.forEach((room) => {
      const ratePlan = room.RatePlans.RatePlan[0];

      HotelDetailsView.renderPlanName(ratePlan);
      HotelDetailsView.renderPlanTotalPriceWithCommission(ratePlan);
      HotelDetailsView.renderPlanSource(ratePlan);
      HotelDetailsView.renderPlanPricePerNight(ratePlan);

      console.log('');
    });
  }

  checkForError() {
    const appResults = this.hotelDetailsModel.results.ApplicationResults || {};
    const isError = appResults.Error !== undefined;

    return isError;
  }

  renderError() {
    const appResults = this.hotelDetailsModel.results.ApplicationResults;

    appResults.Error.forEach((error) => {
      error.SystemSpecificResults.forEach((result) => {
        result.Message.forEach((message) => {
          console.log(`${message.code}...${message.value}`);
        });
      });
    });
    console.log('\n');
  }

  render() {
    if (this.checkForError()) {
      this.renderError();
    } else {
      this.renderSearchCriteria();
      this.renderNameAndRating();
      this.renderLocationAndContact();
      HotelDetailsView.renderSeparator();
      this.renderAmenityAndDescriptionStatistics();
      HotelDetailsView.renderSeparator();
      this.renderRoomRates();
      console.log('\n');
    }
  }
}

module.exports = HotelDetailsView;
