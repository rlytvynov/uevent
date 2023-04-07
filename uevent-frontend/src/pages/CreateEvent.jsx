import React, {useState} from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import DragAndDropImage from '../components/DragImage';
import { FaTimesCircle, FaDollarSign } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { NavLink } from 'react-router-dom';

function CreateEvent() {
    const [inputType1, setInputType1] = useState('text');
    const [inputType2, setInputType2] = useState('text');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            event.preventDefault();
            if(!tags.includes(tagInput)) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
            } else {
                alert('Can not set the same tag')
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };
    
    const [title, setTitle] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [evType, setEvType] = useState('')
    const [placeName, setPlaceName] = useState("");
    const [companyName, setCompanyName] = useState('')
    const [format, setFormat] = useState('')
    const [seats, setSeats] = useState(0)

    const handleMapCoordinates = (placeName) => {
        setPlaceName(placeName);
    };

    const handleEvType = (event) => {
        setEvType(event.target.value);
    };

    const handlePublish = () => {
        const data = {
            title,
            publishDate,
            "event-datetime": eventDate + ' ' + eventTime,
            evType,
            location: placeName,
            description,
            format,
            companyName,
            tags
        }
        console.log(data)
    }

    function handleKeyPress(event) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          event.preventDefault();
        }
      }

    return (
        <div>
            <Component>
                <div className="image">
                    <DragAndDropImage/>
                </div>
                <div className="event">
                    <input 
                        className='title'
                        value={title} 
                        type="text" 
                        placeholder='Event title'
                        onChange = {(e) => {setTitle(e.target.value)}}
                        />
                    <div className="time">
                        <input 
                            className='event-date' 
                            type={inputType1}
                            value={publishDate} 
                            placeholder='Publish date' 
                            onBlur={() => setInputType1('text')} 
                            onFocus={() => setInputType1('date')}
                            onChange = {(e) => {setPublishDate(e.target.value)}}
                            />
                        <div className="date-time">
                            <input 
                                className='event-date' 
                                type={inputType2} placeholder='Date'
                                value={eventDate}  
                                onBlur={() => setInputType2('text')} 
                                onFocus={() => setInputType2('date')}
                                onChange = {(e) => {setEventDate(e.target.value)}}
                                />
                            <input 
                                type="time"
                                value={eventTime}
                                onChange = {(e) => {setEventTime(e.target.value)}}
                                />
                        </div>
                    </div>
                    <div className="textarea">
                        <textarea 
                            id="textarea" 
                            placeholder="Type description here..."
                            value={description}
                            onChange = {(e) => {setDescription(e.target.value)}}>  
                        </textarea>
                    </div>
                    <div className="additionals">
                        <div>
                            <input type="radio" name="ev_type" value="everybody" checked={evType === 'everybody'} onChange={handleEvType}/>
                            <label htmlFor="everybody" style={{marginRight: '10px'}}>Everybody</label>
                            <input type="radio" name="ev_type" value="visitors" checked={evType === 'visitors'} onChange={handleEvType}/>
                            <label htmlFor="visitors">Only visitors</label>
                        </div>
                        <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                            <div className='icon-context'>
                                <FaDollarSign className='icon'/> <input 
                                                                    className='price' 
                                                                    type="text"
                                                                    value={price} 
                                                                    placeholder='Price'
                                                                    onKeyDown={handleKeyPress} 
                                                                    onChange = {(e) => {setPrice(e.target.value)}}
                                                                    />
                            </div>
                        </IconContext.Provider>
                    </div>
                    <div className='chosens'>
                        <div style={{position: "relative"}}>
                            <label htmlFor="formats">Format: </label>
                            <div>
                                <select onChange={(e) => setFormat(e.target.value)} name="formats" id="formats">
                                    <option value="concert">Concert</option>
                                    <option value="meet_up">Meet Up</option>
                                    <option value="fetival">Festival</option>
                                    <option value="show">Show</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="formats">Seats: </label>
                            <input style={{marginLeft: '10px'}} type="text" value={seats} placeholder='Seats' onKeyDown={handleKeyPress} onChange = {(e) => {setSeats(e.target.value)}}/>
                        </div>  
                        <div>
                            <label htmlFor="formats">Company: </label>
                            <div>
                                <select onChange={(e) => setCompanyName(e.target.value)} name="companies" id="companies">
                                    <option value="example1">Comapny1</option>
                                    <option value="example2">Comapny2</option>
                                    <option value="example3">Comapny3</option>
                                </select>
                            </div>
                        </div>        
                    </div>
                    <div style={{textAlign: 'end', fontSize: '10px', color: '#868686'}}>Don't have company? <NavLink style={{color: "#FFD100"}} to='/create-company'>Create now !</NavLink></div>
                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}} className='tags-block'>
                        <input
                            type="text"
                            placeholder="Enter tags here..."
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <div style={{marginLeft: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'flex-start', alignItems: 'center'}} className='tags-array'>
                            {tags.map((tag) => (
                            <div 
                                className='tag' 
                                key={tag} 
                                style={{
                                    display: "inline-block",
                                    backgroundColor: "#e5e5e5",
                                    color: "#333",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}>
                                {tag}
                                <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginLeft: "5px", cursor: "pointer" } }}>
                                    <FaTimesCircle onClick={() => handleRemoveTag(tag)}/>
                                </IconContext.Provider>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Component>
            <MapContainer>
                <h3 className="location">Choose location of the event</h3>
                <Map onChildStateChange={handleMapCoordinates}/>
                <div className="coordinates">
                    <div>Choosen location: {placeName} </div>
                    <button onClick={handlePublish}>Publish</button> 
                </div>
            </MapContainer>
        </div>
    )
}

export default CreateEvent

const MapContainer = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;
    margin-top: 20px;
    .coordinates {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        div {
            width: 45%;
            border: 1px solid #fff;
            padding: 5px 10px;

            -ms-text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow: hidden;
            -ms-line-clamp: 1;
            -webkit-line-clamp: 1;
            line-clamp: 2;
            display: -webkit-box;
            display: box;
            word-wrap: break-word;
            -webkit-box-orient: vertical;
            box-orient: vertical;
        }
        button {
            width: 45%;
            height: 40px;
            background: #FFD100;
            border: none;
            color: #fff;
        }
    }
    
`

const Component = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;

    display: flex;
    justify-content: space-between;
    align-items: stretch;


    .image {
        width: 49%;
    }

    .event {
        width: 49%;
        &>* {
            margin-bottom: 10px;
        }
        input {
            border: 1px solid #fff;
            background: transparent;
            color: #fff;
            padding: 5px;
            padding-left: 10px;
            outline: none;
            &[type="date"]::-webkit-calendar-picker-indicator {
                filter: invert(1);
                background-color: rgb(223, 223, 223);
            }
            &[type="time"] {
                padding: 4px;
                margin-left: 10px;
                &::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    background-color: rgb(223, 223, 223);
                }
            }
            &.price {
                padding-left: 30px;
            }
            &.title {
                font-size: 36px;
                border: none;
                border-bottom: 2px solid #FFFFFF;
                margin-bottom: 25px;
                &::placeholder {
                    font-size: 36px;
                }
            }
        }
        .time {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .textarea {
            position: relative;
            height: 100px;
            textarea {
              width: 100%;
              height: 100%;
              padding: 10px;
              border: 1px solid #fff;
              color: #fff;
              background: transparent;
              resize: none; /* отключаем возможность изменения размеров */
              outline: none;
            }
        }
        .additionals {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chosens {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
                div {
                    border: 1px solid #fff;
                    background: transparent;
                    display: inline-block;
                    padding: 5px;
                    margin-left: 10px;
                    select {
                        outline: none;
                        background: transparent;
                        border: none;
                        color: #fff;
                        margin: 0;
                    }
                }
            }
        }

        .icon-context {
            position: relative;
            .icon {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                color: white;
            }
        }
    }
`