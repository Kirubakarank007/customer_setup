import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Searchbar from "../components/Searchbar";
import CurrentLocation from "../components/currentLocation";
import Congratulation from "../components/Congratulation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"
import styled from "styled-components";
const Navbar=styled.div`
  height:59px;
  display:flex;
  align-items:center;
  background-color:#fff;
  z-index:1;
  position:absolute;
  width:100%;
  @media(width>678px){
    height:104px;
    
  }
`
const Image=styled.img`
  height:24px;
  width:24px;
  margin-left:24px;
  @media(width>678px){
    height:32px;
    width:32px;
    margin-left:156px;
}`

const HeaderText=styled.p`
  font-size:20px;
  color: var(--Fonts-N900, #0F1532);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Manrope;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px; /* 140% */
  letter-spacing: 0.15px;
  margin-left:8px;
  @media(width>678px){
    font-size:24px;
    margin-left:24px;
}`
const SearchContainers=styled.div`
  margin-left:24px;
  margin-right:24px;
  @media(width>678px){
    width:100%;
    margin-left:156px;
    height:48px;
    margin-top:-24px!important;
    }
`
const FacilityContainer=styled.div`
  background-color: white;
  border-radius: 20px 20px 0px 0px;
  box-shadow: 0px 10px 20px 6px rgba(121, 87, 0, 0.10);
  @media(width>678px){
    margin-right:156px;
    width:45%;
    height:auto;
    border-radius: 16px;
    background: var(--Secondary-White, #FFF);
    box-shadow: 0px 10px 20px 6px rgba(121, 87, 0, 0.10);
    }
`
const ButtonContainer=styled.div`
  margin-left:24px;
  margin-right:24px;
  margin-bottom:24px;
  @media(width>678px){
    margin-left:24px;
    margin-right:24px;
    margin-bottom:24px;
}`
const Button=styled.button
` width:100%;
  height:56px;
  text-align:center;
  background-color:#0B30B2;
  color:white;
  border-radius:20px;
  font-size:14px;
  border:none;
  font-family:Manrope;
  @media(width>678px){
    width:100%;
    font-size:16px;
    margin-top:40px;
    font-weight:700;
    letter-spacing:0.15px;
    line-height:24px;
}

`
const FacilitySearchWrap=styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  position:absolute;
  margin-top:74px;
  justify-content:space-between;
  height:85%;
  @media(width>678px){
    flex-direction:row;
    height:auto;
    margin-top:130px;
}
`
const EntryField=styled.fieldset`
  border-radius:14px;
  margin-left:24px;
  margin-top:24px;
  margin-right:24px;
  border:1px solid #D9D4C5;
  @media(width>678px){  
  // height:56px;
}
`
const Legend =styled.legend`
  color: var(--Fonts-N800, #292F4D);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: 0.25px;
  @media(width>678px){
    color: var(--Fonts-N800, #292F4D);
    font-family: Manrope;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.4px;
  }`
const EntryText=styled.input`
  border:none;
  outline:none;
  width:100%;
  background-color:white;
  height:35px;
  color: var(--Fonts-N900, #0F1532);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px; /* 157.143% */
  letter-spacing: 0.25px;
  @media(width>678px){
    font-size:16px;
    letter-spacing: 0.15px;
    
  }

`
const Select=styled.select`
width:100%;
border:none;
height:35px;
`
const BlurBackground = styled.div`
  backdrop-filter: blur(60px); /* Adjust the blur amount as needed */
  // background-color:red;
`;

const Search=styled.div`
    width: 100%;
    height: 48px;
    flex-shrink: 0;
    border-radius: 14px;
    background: var(--secondary-white, #FFF);
    box-shadow: 0px 4px 16px 0px rgba(84, 75, 42, 0.20);
    margin-top:24px;
    @media(width>678px){
        width:100%;
        height:56px;
        border:20px;
        // margin-top:24;
    }
`;

const InnerSearchWrapper=styled.div`
    margin-left:16px;
    margin-right:16px;
    display:flex;
    justify-content:space-between;
`;

const InnerSearch=styled.input`
    margin-top:9px;
    outline:none;
    border:none;
    width:100%;
    font-size:14px;
    @media(width>678px){
        margin-top:15px;
        font-size:16px;
        border-color:white;
        

    }
`;

const ImageSearch=styled.div`
    margin-top:12px;
    @media(width>678px){
        margin-top:15px;
    }
`;

function AddFacilities() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
//   const [liveLocation, setLiveLocation] = useState<{lng:number, lat:number}>({lng: 0, lat: 0});
  const [zoom] = useState<number>(14);
  const [clickedLocation, setClickedLocation] = useState<string>("");
  const [currenLocation, setCurrentLocation] = useState<boolean>(false);
  const [confirmAddress, setConfirmAddress] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [formData, setFormData] = useState({
    facility_nickname: '',
    floor_number: '',
    location: '',
    service: '',
    
    // Add more form fields as needed
  }); 

  const [customValue, setCustomValue] = useState('');
  const [serachQuery, setSearchQuery] = React.useState("");
  const [searchCordinates, setSearchCordinates] = React.useState<{lng:number, lat:number}>({lng: 0, lat: 0});

    const handleSearchInputChange = (e:any) => {
        const { value } = e.target;
        setSearchQuery(value)
      };

      const handleSearchSubmit = async (e:any) => {
        e.preventDefault();
        // Now you have the form data in the formData state variable
        console.log("Search Submit Reached");
        try {
        
          const response = await axios.get(`https://api.maptiler.com/geocoding/${serachQuery}.json?key=DIALvL1pmYZdL29IO9w0` , {
            headers: {
              'Accept': '*/*',
            },
          })
          if (!response.data) {
            throw new Error('Network response was not ok');
          }
          console.log('Success:', response.data);
          const coordinates = response.data.features[0].geometry.coordinates;
    
    // Center the map and add a marker at the searched location
    map.current!.flyTo({
      center: coordinates,
      essential: true,
    });

    // Check if a marker already exists, and if not, create a new one
    if (!marker) {
      marker = new maptilersdk.Marker({ color: "#FFD058", draggable: true })
        .setLngLat(coordinates)
        .addTo(map.current!);
    } else {
      marker.setLngLat(coordinates);
    }

    // Set the state for the clickedLocation
    setClickedLocation(response.data.features[0].place_name);

    // Set the state for searchCordinates
    setSearchCordinates({ lng: coordinates[0], lat: coordinates[1] });
          // setSearchCordinates(response.data.features[0].geometry.coordinates);
          // console.log(response.data.features[0].geometry.coordinates);
        } catch (error) {
          console.error('Error:', error);
        }
      };

  maptilersdk.config.apiKey = 'DIALvL1pmYZdL29IO9w0';

  interface MapOptions {
    container: string | HTMLElement;
    style: maptilersdk.ReferenceMapStyle | maptilersdk.MapStyleVariant;
    center: [number, number];
    zoom: number;
  }
  let marker: maptilersdk.Marker | null = null;

  async function reverseGeocoding(lng: number, lat: number) {
    if (!isNaN(lng) && !isNaN(lat)) {
      const result = await maptilersdk.geocoding.reverse([lng, lat]);
      console.log(result);
      const address = result.features[0]?.place_name || "Address not found";
      setClickedLocation(address);
      if(!searchCordinates){
        if (marker) {
          marker.setLngLat([lng, lat]);
        } else {
          marker = new maptilersdk.Marker({ color: "#FFD058", draggable: true })
            .setLngLat([lng, lat])
            .addTo(map.current!);
  
          
        }
  
        map.current!.flyTo({
          center: [lng, lat],
          essential: true,
        });
      }
      else{
        marker = null
      }
      
    }
  }

  useEffect(() => {
    
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {  
          if (map.current) return; // stops map from initializing more than once

            const options: MapOptions = {
              container: mapContainer.current!,
              style: maptilersdk.MapStyle.STREETS,
              center: [position.coords.longitude, position.coords.latitude],
              zoom: zoom,
            };
            
            map.current = new maptilersdk.Map(options);
            new maptilersdk.Marker({ color: "#FF0000" })
              .setLngLat([position.coords.longitude, position.coords.latitude])
              .addTo(map.current!);
            

            reverseGeocoding(position.coords.longitude, position.coords.latitude);
            // if(searchCordinates){
            //   const coordinates = searchCordinates;
            //   reverseGeocoding(coordinates.lng, coordinates.lat);
            //   // map.current!.flyTo({
            //   //   center: [coordinates.lng, coordinates.lat],
            //   //   essential: true,

            //   // })
            // }
             // Add a click event listener to the map
            map.current!.on("click", (e) => {
                const coordinates = e.lngLat;
                reverseGeocoding(coordinates.lng, coordinates.lat);
            });
        });
    }
    
  }, []);

  const handleSelectChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    // Use the value property of the target to set the state
    const selectedOptionValue = event.target.value;
    setCustomValue(selectedOptionValue);
    setSelectedOption(selectedOptionValue);

  };


  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    formData.location = clickedLocation;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Now you have the form data in the formData state variable
    formData.service = customValue;
    console.log("Handle Submit Reached");
    try {
      const json=JSON.stringify(formData);
      console.log(json);
      const response = await axios.post('https://customer-setup-api.up.railway.app/addfacility', json , {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
      })
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    console.log(formData);
  };

  
  const navigate=useNavigate();
  return (
    
    <>
              <Navbar>
                <Image src="./assets/ArrowLeft.png" onClick={()=>navigate("/")}/>
                <HeaderText >Facility address</HeaderText>
              </Navbar>
    <div style={{
      width: "100%",
      height: "100vh",
      position:"relative"
    }}>
        <div ref={mapContainer} style={{
        position: "absolute",
        width: "100%",
        height: "100vh"
      }} />
        <FacilitySearchWrap>
          <SearchContainers>
            <Search>
                <InnerSearchWrapper >
                    <InnerSearch type='text' placeholder='Search' value={serachQuery} onChange={handleSearchInputChange}/>
                    <ImageSearch onClick={handleSearchSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_7166_5341)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12ZM18.0493 19.9635C16.3696 21.2414 14.2734 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 14.5288 21.0614 16.8383 19.5135 18.5993L22.2071 21.2929C22.5976 21.6834 22.5976 22.3166 22.2071 22.7071C21.8166 23.0976 21.1834 23.0976 20.7929 22.7071L18.0493 19.9635Z" fill="black"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_7166_5341">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </ImageSearch>
                </InnerSearchWrapper>
            </Search>
          </SearchContainers>
          <FacilityContainer>
            {
              !currenLocation ? (
                <>
                  <CurrentLocation clickedLocation={clickedLocation}/>
                  <ButtonContainer >
                  <Button onClick={()=>{setCurrentLocation(true)}} >
                      Use this location
                  </Button>
                  </ButtonContainer>
                </>
              ):(
                <>
                  <form action="/addfacility" method="POST" onSubmit={handleSubmit} className="form">
                    <EntryField>
                      <Legend>Facility nickname*</Legend>
                      <EntryText id="facility_nickname" autoComplete="off" name="facility_nickname" value={formData.facility_nickname} onChange={handleInputChange} required type="text"/>
                    </EntryField>
                    <EntryField >
                      <Legend>Unit number/floor</Legend>
                      <EntryText id="floor_number" autoComplete="off" name="floor_number" value={formData.floor_number} onChange={handleInputChange} type="text"/>
                    </EntryField>
                    <EntryField style={{marginBottom:164}}>
                      <Legend>Select an Option</Legend>
                      {/* <EntryText 
                        id="service"
                        name="service"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        list="optionsList"
                      /> */}
                      <Select >
                        <option value="Gym">Gym</option>
                        <option value="School">School</option>
                        <option value="Park">Park</option>
                        <option value='custom'>Others</option>
                      </Select>
                   
                    </EntryField>

                    <CurrentLocation clickedLocation={clickedLocation}/>
                    <ButtonContainer>
                    <Button onClick={()=>{setConfirmAddress(true)}}>
                        Confirm address
                    </Button>  
                    </ButtonContainer>
                  </form>
                </>
              )
            }
        
          </FacilityContainer>
        </FacilitySearchWrap> {
                (confirmAddress&&currenLocation)&&
                <Congratulation facilityNickName={formData.facility_nickname} />
            }
          </div>   

    
    </>
  );
}
export default AddFacilities;
