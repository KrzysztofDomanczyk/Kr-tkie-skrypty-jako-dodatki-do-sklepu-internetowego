function PageVisitCounter() {
    return {
        visits: 0,
        ip: null,
        baseUrl: "http://localhost/marketing-tools/public",
        productId: 198,
        status: null,
        message: null,
        response: undefined,
        rootElement: $('.projector_navigation'),

        pageCounterVisitor: undefined,
        intervalTime: 10000,
        init: async function () {
            var self = this;
            await this.getIp().then((ip) => {
                self.ip = ip;
                self.createWidget();
                self.addVisit();
                self.setRefreshInterval();
                self.createRemoveVisitEvent();
            });
        },
        
        createWidget: function () {
            this.rootElement.after('<div id="pageCounterVisitor" style="float:left;width:100%;margin-bottom: 25px;font-weight: 800;"></div>');
            this.pageCounterVisitor = $('#pageCounterVisitor');
        },
        updateWidget: function () {
            this.pageCounterVisitor.show();
            this.pageCounterVisitor.html('Liczba obserwuj�cych ten towar to: <span style="padding: 4px;border-radius: 50%;color: rgb(204 51 51);">' + this.visits + '</span>');
        },
        clearWidget: function () {
            this.pageCounterVisitor.hide();
        },
        getVisits: async  function () {
            let url = this.baseUrl +"/get-visitors/"+ this.productId + "/" + this.ip ;
            var self = this;
            await this.send(url).then((data => {
                console.log(data);
                self.visits = data.numberOfVisits;
                if (self.visits <= 1) {
                    this.clearWidget();
                } else {
                    this.updateWidget();
                }
            }));
        },
        setRefreshInterval: function () {
            var self = this;
            setInterval(function () { 
                self.getVisits();
            }, this.intervalTime);
        },
        addVisit: async  function () {
            let url = this.baseUrl + "/add-visitor/" + this.productId + "/" + this.ip;
            await this.send(url).then((data => {
                console.log(data);
                this.getVisits()
            }));
        },
        removeVisit: async  function () {
            let url = this.baseUrl +"/remove-visitor/"+ this.productId + "/" + this.ip ;
            await this.send(url);
        },
        getIp: function () {
            var self = this;
            return new Promise((resolve) => {
                $.getJSON("https://api.ipify.org/?format=json", function (e) {
                }).done(function (e) {
                    resolve(e.ip);
                });
            });
        },
        send: function (url) {
               return new Promise((resolve) => {
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: 'json',
                    crossDomain: true,
                    success: function (msg) { 
                        resolve(msg);
                    }
                });
            });
        },
        createRemoveVisitEvent: function () {
            var self = this;
            window.addEventListener("beforeunload", function (e) {
                self.removeVisit();
            });  
        }

    };
}


$(document).ready(function () {
    const pageVisitCounter = new PageVisitCounter();
    pageVisitCounter.init();
});