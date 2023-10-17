function getLocation() {
    var locationCookie = getCookie('location');
    if (locationCookie == undefined) {
        if (navigator.geolocation) {
            // Show loading GIF container until location is obtained
            document.getElementById('loading-container').style.display = 'flex';

            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    } else {
        // alert('Area Shop is accessible now !');
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    var location = {
        latitude: latitude,
        longitude: longitude
    };
    document.cookie = 'location=' + JSON.stringify(location) + '; expires=' + new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();

    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    document.getElementById('loading-container').style.display = 'flex';

    fetch(reverseGeocodingUrl)
        .then(response => response.json())
        .then(data => {
            const countryName = data.address.country;

            const currencyMapping = {
                'Afghanistan': 'AFN',
                'Albania': 'ALL',
                'Algeria': 'DZD',
                'American Samoa': 'USD',
                'Andorra': 'EUR',
                'Angola': 'AOA',
                'Anguilla': 'XCD',
                'Antarctica': 'XCD',
                'Antigua and Barbuda': 'XCD',
                'Argentina': 'ARS',
                'Armenia': 'AMD',
                'Aruba': 'AWG',
                'Australia': 'AUD',
                'Austria': 'EUR',
                'Azerbaijan': 'AZN',
                'Bahamas': 'BSD',
                'Bahrain': 'BHD',
                'Bangladesh': 'BDT',
                'Barbados': 'BBD',
                'Belarus': 'BYR',
                'Belgium': 'EUR',
                'Belize': 'BZD',
                'Benin': 'XOF',
                'Bermuda': 'BMD',
                'Bhutan': 'BTN',
                'Bolivia': 'BOB',
                'Bosnia and Herzegovina': 'BAM',
                'Botswana': 'BWP',
                'Bouvet Island': 'NOK',
                'Brazil': 'BRL',
                'British Indian Ocean Territory': 'USD',
                'Brunei': 'BND',
                'Bulgaria': 'BGN',
                'Burkina Faso': 'XOF',
                'Burundi': 'BIF',
                'Cambodia': 'KHR',
                'Cameroon': 'XAF',
                'Canada': 'CAD',
                'Cape Verde': 'CVE',
                'Cayman Islands': 'KYD',
                'Central African Republic': 'XAF',
                'Chad': 'XAF',
                'Chile': 'CLP',
                'China': 'CNY',
                'Christmas Island': 'AUD',
                'Cocos (Keeling) Islands': 'AUD',
                'Colombia': 'COP',
                'Comoros': 'KMF',
                'Congo': 'XAF',
                'Cook Islands': 'NZD',
                'Costa Rica': 'CRC',
                'Croatia': 'HRK',
                'Cuba': 'CUP',
                'Cyprus': 'EUR',
                'Czech Republic': 'CZK',
                'Denmark': 'DKK',
                'Djibouti': 'DJF',
                'Dominica': 'XCD',
                'Dominican Republic': 'DOP',
                'East Timor': 'USD',
                'Ecuador': 'ECS',
                'Egypt': 'EGP',
                'El Salvador': 'SVC',
                'England': 'GBP',
                'Equatorial Guinea': 'XAF',
                'Eritrea': 'ERN',
                'Estonia': 'EUR',
                'Ethiopia': 'ETB',
                'Falkland Islands': 'FKP',
                'Faroe Islands': 'DKK',
                'Fiji Islands': 'FJD',
                'Finland': 'EUR',
                'France': 'EUR',
                'French Guiana': 'EUR',
                'French Polynesia': 'XPF',
                'French Southern territories': 'EUR',
                'Gabon': 'XAF',
                'Gambia': 'GMD',
                'Georgia': 'GEL',
                'Germany': 'EUR',
                'Ghana': 'GHS',
                'Gibraltar': 'GIP',
                'Greece': 'EUR',
                'Greenland': 'DKK',
                'Grenada': 'XCD',
                'Guadeloupe': 'EUR',
                'Guam': 'USD',
                'Guatemala': 'QTQ',
                'Guinea': 'GNF',
                'Guinea-Bissau': 'CFA',
                'Guyana': 'GYD',
                'Haiti': 'HTG',
                'Heard Island and McDonald Islands': 'AUD',
                'Holy See (Vatican City State)': 'EUR',
                'Honduras': 'HNL',
                'Hong Kong': 'HKD',
                'Hungary': 'HUF',
                'Iceland': 'ISK',
                'India': 'INR',
                'Indonesia': 'IDR',
                'Iran': 'IRR',
                'Iraq': 'IQD',
                'Ireland': 'EUR',
                'Israel': 'ILS',
                'Italy': 'EUR',
                'Ivory Coast': 'XOF',
                'Jamaica': 'JMD',
                'Japan': 'JPY',
                'Jordan': 'JOD',
                'Kazakhstan': 'KZT',
                'Kenya': 'KES',
                'Kiribati': 'AUD',
                'Kuwait': 'KWD',
                'Kyrgyzstan': 'KGS',
                'Laos': 'LAK',
                'Latvia': 'LVL',
                'Lebanon': 'LBP',
                'Lesotho': 'LSL',
                'Liberia': 'LRD',
                'Libyan Arab Jamahiriya': 'LYD',
                'Liechtenstein': 'CHF',
                'Lithuania': 'LTL',
                'Luxembourg': 'EUR',
                'Macau': 'MOP',
                'North Macedonia': 'MKD',
                'Madagascar': 'MGF',
                'Malawi': 'MWK',
                'Malaysia': 'MYR',
                'Maldives': 'MVR',
                'Mali': 'XOF',
                'Malta': 'EUR',
                'Marshall Islands': 'USD',
                'Martinique': 'EUR',
                'Mauritania': 'MRO',
                'Mauritius': 'MUR',
                'Mayotte': 'EUR',
                'Mexico': 'MXN',
                'Micronesia: Federated States of': 'USD',
                'Moldova': 'MDL',
                'Monaco': 'EUR',
                'Mongolia': 'MNT',
                'Montserrat': 'XCD',
                'Morocco': 'MAD',
                'Mozambique': 'MZN',
                'Myanmar': 'MMR',
                'Namibia': 'NAD',
                'Nauru': 'AUD',
                'Nepal': 'NPR',
                'Netherlands': 'EUR',
                'Netherlands Antilles': 'ANG',
                'New Caledonia': 'XPF',
                'New Zealand': 'NZD',
                'Nicaragua': 'NIO',
                'Niger': 'XOF',
                'Nigeria': 'NGN',
                'Niue': 'NZD',
                'Norfolk Island': 'AUD',
                'North Korea': 'KPW',
                'Northern Ireland': 'GBP',
                'Northern Mariana Islands': 'USD',
                'Norway': 'NOK',
                'Oman': 'OMR',
                'Pakistan': 'PKR',
                'Palau': 'USD' ,
                'Panama': 'PAB',
                'Papua New Guinea': 'PGK',
                'Paraguay': 'PYG',
                'Peru': 'PEN',
                'Philippines': 'PHP',
                'Pitcairn Islands': 'NZD',
                'Poland': 'PLN',
                'Portugal': 'EUR',
                'Puerto Rico': 'USD',
                'Qatar': 'QAR',
                'Reunion': 'EUR',
                'Romania': 'RON',
                'Russian Federation': 'RUB',
                'Rwanda': 'RWF',
                'Saint Helena': 'SHP',
                'Saint Kitts and Nevis': 'XCD',
                'Saint Lucia': 'XCD',
                'Saint Pierre and Miquelon': 'EUR',
                'Saint Vincent and the Grenadines': 'XCD',
                'Samoa': 'WST',
                'San Marino': 'EUR',
                'Sao Tome and Principe': 'STD',
                'Saudi Arabia': 'SAR',
                'Scotland': 'GBP',
                'Senegal': 'XOF',
                'Serbia': 'RSD',
                'Seychelles': 'SCR',
                'Sierra Leone': 'SLL',
                'Singapore': 'SGD',
                'Slovakia': 'EUR',
                'Slovenia': 'EUR',
                'Solomon Islands': 'SBD',
                'Somalia': 'SOS',
                'South Africa': 'ZAR',
                'South Georgia and the South Sandwich Islands': 'GBP',
                'South Korea': 'KRW',
                'South Sudan': 'SSP',
                'Spain': 'EUR',
                'Sri Lanka': 'LKR',
                'Sudan': 'SDG',
                'Suriname': 'SRD',
                'Svalbard and Jan Mayen': 'NOK',
                'Swaziland': 'SZL',
                'Sweden': 'SEK',
                'Switzerland': 'CHF',
                'Syria': 'SYP',
                'Tajikistan': 'TJS',
                'Tanzania': 'TZS',
                'Thailand': 'THB',
                'The Democratic Republic of Congo': 'CDF',
                'Togo': 'XOF',
                'Tokelau': 'NZD',
                'Tonga': 'TOP',
                'Trinidad and Tobago': 'TTD',
                'Tunisia': 'TND',
                'Turkey': 'TRY',
                'Turkmenistan': 'TMT',
                'Turks and Caicos Islands': 'USD',
                'Tuvalu': 'AUD',
                'Uganda': 'UGX',
                'Ukraine': 'UAH',
                'United Arab Emirates': 'AED',
                'United Kingdom': 'GBP',
                'United States': 'USD',
                'United States Minor Outlying Islands': 'USD',
                'Uruguay': 'UYU',
                'Uzbekistan': 'UZS',
                'Vanuatu': 'VUV',
                'Venezuela': 'VEF',
                'Vietnam': 'VND',
                'Virgin Islands: British': 'USD',
                'Virgin Islands: U.S.': 'USD',
                'Wales': 'GBP',
                'Wallis and Futuna': 'XPF',
                'Western Sahara': 'MAD',
                'Yemen': 'YER',
                'Zambia': 'ZMW',
                'Zimbabwe': 'ZW',
            };

            const currencyCode = currencyMapping[countryName];
            const currencySymbolMapping = {
                'BDT': '৳',
                'USD': '$',
            };

            const currencySymbol = currencySymbolMapping[currencyCode];
            document.cookie = 'currencySymbol=' + currencySymbol + '; expires=' + new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = 'currencyCode=' + currencyCode + '; expires=' + new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
            document.getElementById('loading-container').style.display = 'none';
            window.location.reload();
        })
        .catch(error => {
            document.getElementById('loading-container').style.display = 'none';
            console.error('Error getting currency symbol:', error);
        });
}
function showError(error) {
    document.getElementById('loading-container').style.display = 'none';
    if (error.code === error.PERMISSION_DENIED) {
        alert('Location access was denied. Please allow location to access AREA SHOP and try again.');
        getLocation();
    } else {
        alert('Error getting location: ' + error.message);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

window.onload = function () {
    getLocation();
}