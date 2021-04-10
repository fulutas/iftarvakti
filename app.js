// Data
var countries = []
var cities = []
var counties = []
var counter;

// Function
function getTime(){
    var now = new Date()
    var hour = now.getHours()
    var minute = now.getMinutes()

    // Başına 0 ekle
    if(hour < 10) hour = "0" + hour;
    if(minute < 10) minute = "0" + minute;

    document.getElementById('current-time').innerText = hour+" : " +minute;
}


function getCountry(){
    return fetch("https://ezanvakti.herokuapp.com/ulkeler")
        .then(response => response.json())
        .then(data => {
         countries = data;
         var html = "";
         var indexTürkiye = 0 // sıra no 
         for(var i=0; i<data.length; i++){
             html += '<option value="'+ data[i].UlkeID+'">'+data[i].UlkeAdi+'</option>';

             if(data[i].UlkeAdi == "TÜRKİYE") indexTürkiye = i;

         }

         document.getElementById('countries').innerHTML = html;
         document.getElementById('countries').selectedIndex = indexTürkiye; // varsayılan türkiye gelir.

         getCity(2) // Türkiye ID'si
    }).catch(err => alert("Çok fazla istek yapıldı. 100 per 1 day"))
}

function getCity(countryId){
    return fetch("https://ezanvakti.herokuapp.com/sehirler/"+countryId)
            .then(response => response.json())
            .then(data => {
                cities = data;
                var html = "";
                var indexIstanbul = 0;

                for(var i=0; i<data.length; i++){
                    html += '<option value="'+data[i].SehirID + '">'+ data[i].SehirAdi+'</option>';
                    if(data[i].SehirAdi == "İSTANBUL") indexIstanbul = i;
                }

                document.getElementById('cities').innerHTML = html;

                // Ülke kodu Türkiye ise;
                if(countryId == 2){
                    document.getElementById('cities').selectedIndex = indexIstanbul;
                    getCounty(539) // istanbul ID'si
                } else {
                    document.getElementById('cities').selectedIndex = 0
                    getCounty(data[0].SehirID)
                }
            }).catch(err => alert("Çok fazla istek yapıldı"))
}

function getCounty(cityId){
    return fetch("https://ezanvakti.herokuapp.com/ilceler/"+cityId)
    .then(response => response.json())
    .then(data => {
        counties = data;
        var html = "";

        for(var i=0; i< data.length; i++){
            html += '<option value="'+data[i].IlceID + '">'+ data[i].IlceAdi+'</option>';
        }

        document.getElementById('counties').innerHTML = html;
    }).catch(err => alert("Çok fazla istek yapıldı"))
}


function getPrayerTimes(countyId){
    return fetch("https://ezanvakti.herokuapp.com/vakitler/"+countyId)
    .then(response => response.json())
    .then(data => {
        // Güncel tarihi al.
        var currentDate = new Date();
        var day = (currentDate.getDate()< 10) ? "0"+currentDate.getDate() : currentDate.getDate();

        var month = ((currentDate.getMonth()+1)<10) ? "0"+(currentDate.getMonth()+1) : currentDate.getMonth()+1;
        var year = currentDate.getFullYear();

        // Mevcut tarihe ait vakitleri al.
        currentDate = `${day}.${month}.${year}`;
        var index = data.findIndex(d => d.MiladiTarihKisa == currentDate);
        var selectData = data[index];

        document.getElementById('imsak').innerText = "İmsak " + selectData.Imsak;
        document.getElementById('gunes').innerText = "Güneş " + selectData.Gunes;
        document.getElementById('ogle').innerText = "Öğle " + selectData.Ogle;
        document.getElementById('ikindi').innerText = "İkindi " + selectData.Ikindi;
        document.getElementById('aksam').innerText = "Akşam " + selectData.Aksam;
        document.getElementById('yatsi').innerText = "Yatsı " + selectData.Yatsi;

        clearInterval(counter)
        counter = setInterval(() => {
            IftarakalanSure(selectData.Aksam)
        }, 1000);
        
    })
}


function IftarakalanSure(aksam){
    var now = new Date().getTime()
    var endDate = new Date()
    endDate.setHours(aksam.substr(0,2)) // 19
    endDate.setMinutes(aksam.substr(3,2)) // :40
    endDate.setSeconds("0")

    // Akşam vakti ile şuanki zaman arasındaki fark;
    var t = endDate - now;
    
    // Akşam vaktini geçmemiş ise;
    if(t>0){
        var hour = Math.floor((t%(1000*60*60*24))/(1000*60*60));
        var minute = Math.floor((t%(1000*60*60))/(1000*60))
        var second = Math.floor((t%(1000*60))/1000);

        document.getElementById('time-left').innerText = ("0" + hour).slice(-2)+ ":" + ("0"+minute).slice(-2)+ ":"+("0"+second).slice(-2)
    }
    else {
        document.getElementById('time-left').innerText = "00:00:00"
    }
}


function changeCountry(){
    var country = document.getElementById('countries').value;
    getCity(country)
}

function changeCity(){
    var city = document.getElementById('cities').value;
    getCounty(city)
}

function changeLocation(){
    var countryInput = document.getElementById('countries')
    var country = countryInput.options[countryInput.selectedIndex].text; // seçilen ülkenin adını al

    var cityInput = document.getElementById('cities')
    var city = cityInput.options[cityInput.selectedIndex].text; // seçilen şehir adını al

    var countyInput = document.getElementById('counties')
    var county = countyInput.options[countyInput.selectedIndex].text; // seçilen ilçe adını al

    document.getElementById('country').innerText = country;
    document.getElementById('city').innerText = city;
    document.getElementById('county').innerText = county;

    getPrayerTimes(countyInput.value)
    
    // modal close
    $('#locationModal').modal('hide')
}


// Run 
setInterval(() => {
   getTime() 
}, 1000);

getCountry()
getPrayerTimes(9541)