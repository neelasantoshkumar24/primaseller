import React, { Component } from 'react';
import { Item, Segment, Image, Loader, Button, Pagination } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import $ from 'jquery';
import _ from 'lodash';
import Tracks from './Tracks';

export default class Albums extends Component{

  constructor(props){
    super(props)
    this.state = {
     Albums:'',
     hideDialog:false,
     albumId:'',
     albumName:'',
     albumReleaseYear:'',
     activePage: 1,
     totalPages: '',
     start:'',
     end:'',
     loadActive:false
    }
    //console.log(this.props);
  }

  componentDidMount(){
    this.setState({loadActive:true})
    const albums = parseInt(this.props.location.state.albumState)
    $.ajax({
      type: "GET",
      url: 'http://www.theaudiodb.com/api/v1/json/1/album.php?i='+ albums,
      cache: false,
      success: function(result){
        if (result['album']!=null) {
          this.setState({loadActive:false})
          this.setState({totalPages: Math.ceil(result['album'].length/5)})
          this.setState({Albums:result})
        }else{
          this.setState({loadActive:false})
          alert("No albums present for this artist")
          this.props.history.goBack()
        }
      }.bind(this),
      error: function(result){
        alert('Error,please enter correct value')
      }.bind(this)
    });
    this.setState({start:0,end:5})
  }

  openDialog = (e) => {
    this.setState({albumName:e.target.getAttribute('albumName')})
    this.setState({albumReleaseYear:e.target.getAttribute('albumRelease')})
    this.setState({albumId:e.target.getAttribute('value')})
    this.setState({ hideDialog: !this.state.hideDialog });
  }

   handlePaginationChange = (e, { activePage }) => {
      let startAt
      let endAt
      if (activePage === 1) {
        startAt = 0
        endAt = 5
      }else{
        startAt = this.state.end
        endAt = activePage*5
      }
      this.setState({ activePage })
      this.setState({ start:startAt, end:endAt })
   }

   goBack = () => {
     this.props.history.goBack()
   }

  render(){
    const albums = []
    const openDialog = this.openDialog

    const {
     activePage,
     totalPages,
    } = this.state

     const startNum = this.state.start
     const endNum = this.state.end

    _.forEach(this.state.Albums,function(value,key){
      value.slice(startNum,endNum).map(v => {
        albums.push(
          <Segment>
            <Item className="text-center">
              <Item.Image size='tiny' src={v.strAlbumThumb!=null || v.strArtistThumb != '' ? v.strAlbumThumb : 'NA'} />
              <Item.Content>
                <Item.Header as='a'>Artist Name : { v.strArtist!=null || v.strArtist !='' ? v.strArtist : 'NA' }</Item.Header>
                <Item.Meta>Style : { v.strStyle!=null || v.strStyle !='' ? v.strStyle : 'NA' }</Item.Meta>
                <Item.Description>
                  <p>Album : { v.strAlbum }</p>
                </Item.Description>
                <Item.Extra value={v.idAlbum} albumName={v.strAlbum} albumRelease={v.intYearReleased} onClick={openDialog} style={{'cursor':'pointer'}}>View Tracks</Item.Extra>
              </Item.Content>
            </Item>
          </Segment>
        )
      })
    })


    return(
      <div className="container mt-5">
      {this.state.loadActive ? <Loader active inline='centered' /> : <Loader disabled inline='centered' />}
        <div className="row align-items-center">
          <div className="offset-lg-3 col-lg-6">
            <Button positive onClick = {this.goBack}>Go Back</Button>
            <Item.Group>
              <h5>Albums</h5>
              {albums}
            </Item.Group>
            <div className="row">
              <div className="col text-center">
                {
                  _.isEmpty({albums}) ?
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
            {this.state.hideDialog ? <Tracks onClick={this.props.openDialog} albumNameDetails={this.state.albumName} albumReleaseDetails={this.state.albumReleaseYear} albumDetails={this.state.albumId}/> : null}
          </div>
        </div>
      </div>
    )
  }

}
