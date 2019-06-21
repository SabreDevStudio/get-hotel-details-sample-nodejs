const axios = require('axios');
const fileHelper = require('./fileHelper');

function ComputeRequestPayload(searchCriteria) {
  const requestPayload = {
    GetHotelDetailsRQ: {
      version: '1.1.0',
      SearchCriteria: {
        HotelRefs: {
          HotelRef: {
            HotelCode: searchCriteria.hotelCode,
            CodeContext: 'GLOBAL',
          },
        },
        RateInfoRef: {
          CurrencyCode: 'USD',
          ConvertedRateInfoOnly: false,
          PrepaidQualifier: 'IncludePrepaid',
          StayDateRange: {
            StartDate: searchCriteria.date.checkIn,
            EndDate: searchCriteria.date.checkOut,
          },
          Rooms: {
            Room: [
              {
                Index: 1,
                Adults: 1,
                Children: 1,
                ChildAges: '1',
              },
            ],
          },
          RatePlanCandidates: {
            ExactMatchOnly: false,
            RatePlanCandidate: [
              {},
            ],
          },
          InfoSource: '100,110,112,113',
        },
        HotelContentRef: {
          DescriptiveInfoRef: {
            PropertyInfo: true,
            LocationInfo: true,
            Amenities: true,
            Descriptions: {
              Description: [
                {
                  Type: 'ShortDescription',
                },
                {
                  Type: 'Alerts',
                },
                {
                  Type: 'Dining',
                },
                {
                  Type: 'Facilities',
                },
                {
                  Type: 'Recreation',
                },
                {
                  Type: 'Services',
                },
                {
                  Type: 'Attractions',
                },
                {
                  Type: 'CancellationPolicy',
                },
                {
                  Type: 'DepositPolicy',
                },
                {
                  Type: 'Directions',
                },
                {
                  Type: 'Policies',
                },
                {
                  Type: 'SafetyInfo',
                },
                {
                  Type: 'TransportationInfo',
                },
              ],
            },
            AdditionalCharges: true,
            PointOfInterests: true,
            Airports: true,
            AcceptedCreditCards: true,
            GuaranteePolicies: true,
          },
          MediaRef: {
            MaxItems: 'ALL',
            MediaTypes: {
              Images: {
                Image: [
                  {
                    Type: 'ORIGINAL',
                  },
                ],
              },
            },
            AdditionalInfo: {
              Info: [
                {
                  Type: 'CAPTION',
                  value: true,
                },
              ],
            },
            Languages: {
              Language: [
                {
                  Code: 'EN',
                },
                {
                  Code: 'ES',
                },
                {
                  Code: 'IT',
                },
              ],
            },
          },
        },
      },
    },
  };

  return JSON.stringify(requestPayload);
}

class HotelDetailsModel {
  constructor(params) {
    this.searchCriteria = params.searchCriteria;
    this.apiAccessToken = params.apiAccessToken;
    this.appId = params.appId;
    this.apiEndPoint = params.apiEndPoint;
  }

  get results() {
    let rc = this.searchResponse.GetHotelDetailsRS.HotelDetailsInfo;

    if (!rc) {
      rc = this.searchResponse.GetHotelDetailsRS;
    }

    return rc;
  }

  async read() {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.apiEndPoint}/v1.1.0/get/hoteldetails`,
        data: ComputeRequestPayload(this.searchCriteria),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${this.apiAccessToken}`,
          'Application-ID': this.appId,
        },
      });

      this.searchResponse = response.data;
      fileHelper.writeData(JSON.stringify(this.searchResponse), './cachedResponse.json');
    } catch (error) {
      console.log('\nUnexpected error calling hotel get availability.');
      console.log(`[${error.response.status}] ... [${error.response.statusText}]`);
      console.log(`[${error.response.data.errorCode}] ... [${error.response.data.message}]`);
      fileHelper.writeData(JSON.stringify(error.response.data), './cachedResponse.json');
    }
  }
}

module.exports = HotelDetailsModel;
