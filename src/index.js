import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';

// function DataList(props){
    
//     const countries =props.countries.slice()
//     const datalist = countries.map((country) => <option key={country.CountryCode}>{country.Country}</option>)
//     return datalist
// }

class SearchMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedRegion: '',
        }
    }
    render(){
        return(
            <div className='Search-Container'>
                <h1>Covid-19 Reporter</h1>
                <div className='Search-Bar'>
                    <select 
                        className='Region-Selector' 
                        value={this.state.selectedRegion} 
                        onChange={
                            (e)=>{
                                this.props.selecthandle(e.target.value)
                                this.setState({selectedRegion:e.target.value})
                            }
                        }
                    >
                        <option disabled={true} value=''>Select Region</option>
                        <option>Worldwide</option>
                        <option>Africa</option>
                        <option>Americas</option>
                        <option>Asia</option>
                        <option>Europe</option>
                        <option>Oceania</option>
                    </select>
                    <input className='Search' list='country-search' placeholder='Search' onChange={e=>this.props.searchchange(e.target.value)}>
                    </input>
                </div>
            </div>
        )
    }
    
}

function CountriesInfo(props){
    const txtsearched = props.searched;
    const regionarray = props.regionarray;
    const countries = props.countries.slice();
    let selectedCountries;
    if(regionarray && regionarray!=='ww'){
        selectedCountries = countries.filter(country => {
            return regionarray.includes(country.CountryCode)
        })
    }else selectedCountries = countries.slice();
    if(txtsearched) selectedCountries = selectedCountries.filter(country =>{
        return country.Country.toLowerCase().includes(txtsearched.toLowerCase())
    })
    const global = props.global;
     if(!selectedCountries || !global) return null; 
    const listCountries = selectedCountries.map((country) =>{
        const flagSrc = `https://flagcdn.com/w160/${country.CountryCode.toLowerCase()}.png`
        
        return(
        <div className='info-card' key={country.CountryCode}>
            <img className='country-flag' src={flagSrc} alt="flag"/>
            <p className='country-name'>{country.Country}</p>
            <p className='country-confirmed'>{country.TotalConfirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            <p className='country-deaths'>{country.TotalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            <p className='country-recovered'>{country.TotalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
        )
        }
    )

    const listGlobal = (global)=>{
        return(
        <div className='info-card world-wide'>
            <img className='country-flag' src='https://i2x.ai/wp-content/uploads/2018/01/flag-global.jpg' alt='flag' />
            <p className='country-name'>Global</p>
            <p className='country-confirmed'>{global.TotalConfirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            <p className='country-deaths'>{global.TotalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            <p className='country-recovered'>{global.TotalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
        )
    }

    return(
        <section className='country-container'>
            <header className='sticky-card'> 
                <SearchMenu selecthandle = {value => props.selecthandle(value)} searchchange= {searched => props.searchchange(searched)} countries={countries}/>
                <div className='info-card card-title'>
                    <p className='country-title title'>Countries</p>
                    <p className='country-confirmed title'>Total Confirmed</p>
                    <p className='country-deaths title'>Total Deaths</p>
                    <p className='country-recovered title'>Total Recovered</p>
                </div>
                {listGlobal(global)}
            </header>
            {listCountries}
        </section>
    )
}

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            GlobalInfo: '',
            Countries: '',
            SelectedRegion: null,
            RegionArray: null,
            TxtSearched:'',
        }
        this.GetCovidAPI()
    }
    
    async SelectRegion(value){
        await this.setState({SelectedRegion: value})
        if(this.SelectRegion){
            if(this.state.SelectedRegion === 'Worldwide'){
                this.setState({RegionArray: 'ww'},)
            }else {
                const apilink = `https://restcountries.eu/rest/v2/region/${this.state.SelectedRegion}`;
                const api = await axios.get(apilink);
                const data = await api.data
                const arrayData = data.map(contry => {
                    return contry.alpha2Code
                })
                this.setState({RegionArray: arrayData},)
            }
        }

    }

    searchchange(value){
        this.setState({TxtSearched:value})
    }
        
    componentDidMount() {
        
    }

    async GetCovidAPI(){
        const apilink = 'https://api.covid19api.com/summary';
        const api = await axios.get(apilink);
        const data = await api.data
        this.setState({Countries: data.Countries,})
        const globalInfo = data.Global
        this.setState({GlobalInfo: globalInfo,})
    }


    render(){
        return (
            <div>
                {/* <GlobalInfo 
                    confirmed = {this.state.GlobalInfo.TotalConfirmed} 
                    recovered = {this.state.GlobalInfo.TotalRecovered} 
                    death = {this.state.GlobalInfo.TotalDeaths} 
                /> */}
                <CountriesInfo 
                    countries = {this.state.Countries} 
                    global = {this.state.GlobalInfo}
                    regionarray = {this.state.RegionArray}
                    selecthandle = {value => this.SelectRegion(value)}
                    searchchange= {searched => this.searchchange(searched)}
                    searched = {this.state.TxtSearched}
                />
            </div>
            
        )
    }
}

ReactDOM.render(<App />, document.querySelector('#root'))