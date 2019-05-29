import { Component, OnInit } from '@angular/core';
import {ElectionCandidateService} from '../services/election-candidate.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { stringify } from 'querystring';

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {

  candidates: {
    name: string,
    party: string
  } [] = [];
  voteForm = new FormGroup({
    name: new FormArray([])
  });
  constructor(private service: ElectionCandidateService, private route: Router) {
  }

  ngOnInit() {
    this.service.getData()
    .subscribe((response: {
      success: boolean,
      message:{
        candidate_details: {
          name: string,
          party: string
        }[],
        user_details:{
          user_id: string,
          token: string
        }
      }
    })=>{
      if(response.success){
        sessionStorage.setItem('user_id', response.message.user_details.user_id);
        sessionStorage.setItem('token', response.message.user_details.token);
        this.candidates = this.candidates.concat(response.message.candidate_details);
        for(let newCandidate of this.candidates){
          (this.voteForm.get('name') as FormArray).push(new FormControl(newCandidate.name));
        }
      }
    })
  }

  vote(){
    console.log('ngSubmit works!');
    (this.voteForm.get('name') as FormArray)
  }

}
