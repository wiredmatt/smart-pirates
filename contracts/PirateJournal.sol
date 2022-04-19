// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

struct Pirate {
    string name;
    string surname;
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

    constructor(string memory name, string memory surname) {
        author = Pirate(name, surname);
    }

    function recordEntry(
        uint256 page,
        string memory title,
        string memory date,
        string memory text
    ) public {
        entries[page] = JournalEntry(title, date, text);
    }
}
