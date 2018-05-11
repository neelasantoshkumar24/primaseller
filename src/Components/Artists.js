import React, { Component } from 'react';
import { Item, Segment , Loader } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import $ from 'jquery';
import _ from 'lodash';
import { Input, Form, Row } from 'formsy-react-components';
import { Link } from 'react-router-dom';
import { Pagination } from 'semantic-ui-react';

export default class Artists extends Component {
  constructor(props){
    super(props);
    this.state = {
      artistName:'',
      ArtistsNames:'',
      activePage: 1,
      totalPages: '',
      start:'',
      end:'',
      loadActive:false
    }
  }


  submitForm = (data) => {
    this.setState({loadActive:true})
    $.ajax({
      type: "GET",
      url: 'http://www.theaudiodb.com/api/v1/json/1/search.php?s='+data.artistname,
      cache: false,
      success: function(result){
        if (result['artists']!=null) {
          this.setState({loadActive:false})
          this.setState({totalPages:Math.ceil(result['artists'].length/5)})
          this.setState({ArtistsNames:result})
        }else{
          this.setState({loadActive:false})
          alert('Enter Valid Artists Name')
        }
      }.bind(this),
      error: function(result){
        this.setState({artistName:''})
        alert('Error,Enter Valid Artists Name')
      }.bind(this)
    });
    //console.log("artisi",this.state.totalPages);
  }

  handlePaginationChange = (e, { activePage }) => {
     let startAt
     let endAt
     if (activePage == 1) {
       startAt = 0
       endAt = 5
     }else{
       startAt = this.state.end
       endAt = activePage*5
     }
  }


  render() {
    const {
     activePage,
     totalPages,
    } = this.state

    const Artist = []
    const LinkValue = '/viewalbums'
    _.forEach(this.state.ArtistsNames,function(value,key){
      _.forEach(value,function(v,k){
        Artist.push(
          <Segment>
            <Item className="text-center">
              <Item.Image size='tiny' src={v.strArtistThumb!=null || v.strArtistThumb == '' ? v.strArtistThumb : 'NA'} />
              <Item.Content>
                <Item.Header as='a'>Artist Name : { v.strArtist }</Item.Header>
                <Item.Meta>Style : { v.strStyle == null || v.strStyle == ''  ? 'NA' : v.strStyle }</Item.Meta>
                <Item.Description>
                  <p>Country : { v.strCountry == null || v.strCountry == '' ? 'NA' : v.strCountry }</p>
                </Item.Description>
                <Item.Extra><Link to={{pathname:LinkValue,state:{albumState:v.idArtist}}}>View Albums</Link></Item.Extra>
              </Item.Content>
            </Item>
          </Segment>
        )
      })
    })

    return (
        <div className="container mt-5">
         {this.state.loadActive ? <Loader active inline='centered' /> : <Loader disabled inline='centered' />}
          <div className="row align-items-center">
            <div className="offset-lg-3 col-lg-6">
              <Form onSubmit={this.submitForm}>
                <Input
                  name="artistname"
                  value={this.state.artistname}
                  label="Enter Artist Name"
                  placeholder='Enter Artist Name Ex:Adele'
                  type="text"
                  required
                />
                <div className="row">
                  <div className="col text-center">
                    <input
                      className="btn btn-primary"
                      type="submit"
                      defaultValue="Submit"
                    />
                  </div>
                </div>
              </Form>

              <Item.Group>
                {Artist}
              </Item.Group>
              <div className="row">
                <div className="col text-center">
                    {
                      _.isEmpty(Artist) ?
                        null
                       :
                       <Pagination
                           activePage={activePage}
                           onPageChange={this.handlePaginationChange}
                           size='mini'
                           totalPages={this.state.totalPages}
                       />
                    }
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
