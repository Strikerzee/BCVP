import { Component, OnInit } from '@angular/core';
import {ElectionCandidateService} from '../services/election-candidate.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

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
    name: new FormArray([]),
    candidateName: new FormControl('')
  });
  constructor(private service: ElectionCandidateService, private route: Router) {
  }

  ngOnInit() {
    this.service.getData('dashboard')
    .subscribe((response: {
      success: boolean,
      message:
      {
        candidate_details: 
        {
          name: string,
          party: string
        }[], user_details:
        {
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

  vote() {
    this.service.postData({
      candidate: this.voteForm.get('candidateName').value
    }, 'submit')
    .subscribe((response: {
      success: boolean,
      message: string
      })=>{
      if(response.success){
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('token');
        console.log('user voted!');
      }
    })
  }

}
