/*eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll", "New_Poll", "NewVote"] }]*/
import AbstractContractDAO from './AbstractContractDAO';
import TimeProxyDAO from './TimeProxyDAO';
import bytes32 from '../utils/bytes32';

class VoteDAO extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/Vote.json'), at, false);
    }

    polls = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.polls.call( index, {from: account} ));
    };

    pollsCount = (account: string) => {
        return this.contract.then(deployed => deployed.pollsCount.call( {from: account} ));
    };

    NewPoll = (pollTitle: string, pollDescription: string, options: array, account: string) => {
        let count = options.length;
        let voteLimit = 150;
        let deadline = 123;
        pollTitle = bytes32(pollTitle);
        pollDescription = bytes32(pollDescription);
        options = options.map(item => bytes32(item));
        return this.contract.then(deployed => deployed.NewPoll(
            options, pollTitle, pollDescription, voteLimit, count, deadline, {from: account, gas: 3000000})
        );
    };

    getPollTitles = (account: string) => {
        return this.contract.then(deployed => deployed.getPollTitles.call( {from: account} ));
    };

    getOptionsForPoll = (index, account: string) => {
        return this.contract.then(deployed => deployed.getOptionsForPoll.call( index, {from: account} ));
    };

    getOptionsVotesForPoll = (index, account: string) => {
        return this.contract.then(deployed => deployed.getOptionsVotesForPoll.call( index, {from: account} ));
    };

    vote = (pollKey, option, account: string) => {
        return this.contract.then(deployed => {
            return deployed.vote.call(pollKey, option, {from: account} )
                .then(r => {
                    if (r) {
                        deployed.vote(pollKey, option, {from: account} )
                    }
                    return r;
                })
        }
        )
    };

    // deposit = (amount: number, account: string) => {
    //     return this.contract.then(deployed => deployed.deposit( amount, {from: account, gas: 3000000} ));
    // };
    //
    depositAmount = (amount: number, address: string) => {
        return this.contract.then(deployed =>
            TimeProxyDAO.approve(deployed.address, amount, address).then(() => {
                deployed.deposit(amount, {from: address, gas: 3000000});
            })
        );
    };


    newPollWatch = callback => this.contract.then(deployed => deployed.New_Poll().watch(
        (e, r) => callback(r.args._pollId.toNumber())
    ));

    //newVoteWatch = callback => this.contract.then(deployed => deployed.NewVote().watch(callback));

    newVoteWatch = callback => this.contract.then(deployed => deployed.NewVote().watch(
        (e, r) => callback(r.args._choice.toNumber())
    ));

}

export default new VoteDAO();