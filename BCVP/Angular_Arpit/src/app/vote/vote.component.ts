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
  } [];
  voteForm = new FormGroup({
    name: new FormArray([])
  });
  route: Router;
  service: ElectionCandidateService;
  constructor(service: ElectionCandidateService, route: Router) {
    this.route = route;
    this.candidates = [{
      name: "Rajendra Avasthi",
      party: "BJP"
    },
    {
      name: "Loki",
      party: "Congress"
    },
    {
      name: "Ajam Khan",
      party: "SP"
    },
    {
      name: 'Seema Upadhyay',
      party: "BSP"
    }
  ]
    for(let newCandidate of this.candidates){
      (this.voteForm.get('name') as FormArray).push(new FormControl(newCandidate.name))
    }
  }

  ngOnInit() {
    // (this.service.getData("https://localhost:8000/candidates"))
    //   .subscribe((response)=>{
    //     this.candidates.push({
    //       name: response.name,
    //       party: response.party
    //     });
    //   },
    //   (error)=>{
    //     console.log(error);
    //   })
  }

  vote(){
    console.log('ngSubmit works!');
  }

}
