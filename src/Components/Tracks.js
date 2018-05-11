import React, { Component } from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import {  DefaultButton } from 'office-ui-fabric-react/lib/Button';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
let tracksResult;

export default class Tracks extends Component{

  constructor(props){
    super(props)
    this.state = {
      hideDialog: true,
      tracksResult:'',
      loadin:false
    }
    // console.log(this.props);
  }

  closeDialog = () => {
    this.setState({ hideDialog: !this.state.hideDialog });
  }

  componentWillMount(){
    this.setState({loading:true})
    const albumdet = parseInt(this.props.albumDetails)
    $.ajax({
      type: "GET",
      url: 'http://www.theaudiodb.com/api/v1/json/1/track.php?m='+ albumdet,
      cache: false,
      success: function(result){
        this.setState({loading:false})
        this.setState({tracksResult:result['track']})
        tracksResult = result['track']
      }.bind(this),
      error: function(result){
        this.setState({loading:false})
        alert(result)
      }.bind(this)
    });
  }

  render(){

    let trackItems = []
    _.map(this.state.tracksResult,function(value){
        trackItems.push(value)
    })

    let albumname = "Album Name : " + this.props.albumNameDetails
    let albumrelease = "Album Release Year : " +this.props.albumReleaseDetails

    return(
      <div>
      <Dialog
         isOpen={this.state.hideDialog}
         onDismiss={ this.state.hideDialog }
         dialogContentProps={ {
          type: DialogType.largeHeader,
          title: albumname,
          subText: albumrelease
        } }
        modalProps={ {
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        } }
      >
        <div>
        {this.state.loading ? 'loading.....' : null}
        {
          _.map(trackItems,function(item){
            const hours = item['intDuration']
            return (
              <li>{item['strTrack'] +' : '+ moment.utc(hours*1000).format('HH:mm:ss')}</li>
            )
          })
        }
        </div>
        <DialogFooter>
          <DefaultButton onClick={ this.closeDialog } text='Cancel' />
        </DialogFooter>
      </Dialog>
    </div>
    )
  }
}
