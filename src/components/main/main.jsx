import React from "react";
import './main.less'




const sendRequest = (url) => {
  return fetch(url).then( response => {
    return response;
  })
};

const URLS = [`https://www.cbr-xml-daily.ru/daily_json.js`,`http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml`]
const promises = URLS.map(url=>sendRequest(url))





class Main  extends React.PureComponent {
 constructor() {
   super();
   this.interval;
   this.state = {
     curs:''
   }
 }

 componentDidMount() {
   this.runPromises(promises)
   this.interval =  setInterval(()=>{this.runPromises(promises)},10000)
 }
 componentWillUnmount() {
   clearInterval(this.interval)
 }

  runPromises(promises)  {
    Promise.allSettled(promises)
      .then((results) => {
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            sendRequest(result.value.url)
              .then(response => response.json())
              .then(res=>this.setState({curs:res.Valute.EUR.Value}))
          }
        })
      })
  }
  render() {
    const {curs} = this.state

    return (
      <main>
        <span>
         EUR:
        </span>
        <span>
           {curs} Рублей
        </span>
      </main>
    )
  }
}

export default Main;
