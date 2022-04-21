// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

struct Pirate {
    string name;
    string surname;
    address publicKey;
}

struct JournalEntry {
    string title;
    string date;
    string text;
}

contract PirateJournal {
    Pirate public author;

    //  page number => entry
    mapping(uint256 => JournalEntry) public entries;

    modifier onlyAuthor() {
        require(
            msg.sender == author.publicKey,
            "You're not the author of this journal!"
        );
        _;
    }

    constructor(string memory name, string memory surname) {
        author = Pirate(name, surname, msg.sender);
    }

    function recordEntry(
        uint256 page,
        string memory title,
        string memory date,
        string memory text
    ) external onlyAuthor returns (JournalEntry memory) {
        JournalEntry memory entry = JournalEntry(title, date, text);
        entries[page] = entry;
        return entries[page];
    }
}
