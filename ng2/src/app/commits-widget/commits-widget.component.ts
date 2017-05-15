import { Component, OnInit } from '@angular/core';

import { GithubService } from '../_services/github.service';

@Component({
  selector: 'app-commit-widget',
  templateUrl: './commits-widget.component.html',
  styleUrls: ['./commits-widget.component.css']
})
export class CommitWidgetComponent implements OnInit {

  private repoName: string;

  private loadingCommits: boolean;
  private rightButtonDisabled: boolean;
  private leftButtonDisabled: boolean;

  private commits;
  private currentCommit;
  private commitsCount: number;
  private commitIndex: number; // Tracker for commit currently shown

  constructor(private githubService: GithubService) {
    this.commits = [];
    this.commitsCount = 0;
    this.commitIndex = 0;

    this.loadingCommits = true;
    this.leftButtonDisabled = true;
    this.rightButtonDisabled = true;
  }

  ngOnInit() {
    this.loadSampleData();
  }

  ngAfterViewInit() { }

  /**
   * Increment the commitIndex if possible, then update buttons and the displayed commit information
   */
  onRightClick() {
    if (this.commitIndex < this.commitsCount) {
      this.commitIndex++;

      // Update button capabilities
      if (this.commitIndex == this.commitsCount - 1) this.rightButtonDisabled = true;
      if (this.commitIndex > 0) this.leftButtonDisabled = false;

      this.updateCommitInfo();
    }
  }

  /**
   * Decrement the commitIndex if possible, then update buttons and the displayed commit information
   */
  onLeftClick() {
    if (this.commitIndex > 0) {
      this.commitIndex--;

      // Update button capabilities
      if (this.commitIndex < this.commitsCount) this.rightButtonDisabled = false;
      if (this.commitIndex == 0) this.leftButtonDisabled = true;

      this.updateCommitInfo();
    }
  }

  /**
   * Update the commit HTML display elements with the currently selected commit
   */
  updateCommitInfo() {
    // Grab the current commit
    this.currentCommit = this.commits[this.commitIndex].commit;

    // Update HTML elements with the commit information
    document.getElementById('commitAuthor').innerText = this.currentCommit.committer.name;
    document.getElementById('commitMessage').innerText = this.currentCommit.message;
    document.getElementById('commitSha').innerText = this.currentCommit.sha;

    let commitDate = new Date(this.currentCommit.committer.date);
    document.getElementById('commitDate').innerText = commitDate.toLocaleString();
  }

  /**
   * Populate commit widget with sample data
   */
  loadSampleData() {
    console.log("Loading sample commit data");

    this.loadingCommits = true;

    this.repoName = "Sample Repo";

    // Clear then repopulate commits
    this.commits = [];

    // TODO: getCommitsSlowly is temporary for testing, to be replaced with getCommits
    this.githubService.getCommitsSlowly()
      .then(commits => {
        console.log("Github commits fetch success");
        this.commits = commits;

        // Setup some vars TODO: Move this to appropriate spot
        this.loadingCommits = false;
        this.commitIndex = 0;
        this.commitsCount = this.commits.length;
        // Enable the right button if there's more than one commit
        if (this.commitsCount > 0) this.rightButtonDisabled = false;

        this.updateCommitInfo();
      })
      .catch(error => {
        console.error("Error fetching github commits: " + error);
        // TODO: Display en error of sorts to the user
      });
  }
}
