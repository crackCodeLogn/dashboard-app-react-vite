/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 5.29.2
 * source: FixedDeposit.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";

export enum AccountType {
    IND = 0,
    TFSA = 1,
    NR = 2,
    FHSA = 3
}
export enum RenewalType {
    RENEW_AMOUNT = 0,
    RENEW_DEPOSIT = 1,
    DO_NOT_RENEW = 2
}
export enum InterestType {
    ON_MATURITY = 0,
    QUARTERLY = 1,
    MONTHLY = 2
}
export enum OrderFDsBy {
    START_DATE = 0,
    END_DATE = 1,
    DEPOSIT_AMOUNT = 2,
    RATE_OF_INTEREST = 3,
    MONTHS = 4
}
export enum FilterBy {
    ALL = 0,
    USER = 1,
    ORIGINAL_USER = 2,
    KEY = 3,
    BANK = 4,
    CCY = 5
}
export class FixedDeposit extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        user?: string;
        fdNumber?: string;
        customerId?: string;
        bankIFSC?: string;
        depositAmount?: number;
        rateOfInterest?: number;
        startDate?: string;
        endDate?: string;
        months?: number;
        days?: number;
        interestType?: InterestType;
        nominee?: string;
        expectedAmount?: number;
        expectedInterest?: number;
        calculatedDays?: number;
        isFdActive?: boolean;
        isFdBroken?: boolean;
        originalUser?: string;
        annualBreakdownList?: AnnualBreakdownList;
        accountType?: AccountType;
        freeze?: number;
        renewalType?: RenewalType;
        externalId?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("user" in data && data.user != undefined) {
                this.user = data.user;
            }
            if ("fdNumber" in data && data.fdNumber != undefined) {
                this.fdNumber = data.fdNumber;
            }
            if ("customerId" in data && data.customerId != undefined) {
                this.customerId = data.customerId;
            }
            if ("bankIFSC" in data && data.bankIFSC != undefined) {
                this.bankIFSC = data.bankIFSC;
            }
            if ("depositAmount" in data && data.depositAmount != undefined) {
                this.depositAmount = data.depositAmount;
            }
            if ("rateOfInterest" in data && data.rateOfInterest != undefined) {
                this.rateOfInterest = data.rateOfInterest;
            }
            if ("startDate" in data && data.startDate != undefined) {
                this.startDate = data.startDate;
            }
            if ("endDate" in data && data.endDate != undefined) {
                this.endDate = data.endDate;
            }
            if ("months" in data && data.months != undefined) {
                this.months = data.months;
            }
            if ("days" in data && data.days != undefined) {
                this.days = data.days;
            }
            if ("interestType" in data && data.interestType != undefined) {
                this.interestType = data.interestType;
            }
            if ("nominee" in data && data.nominee != undefined) {
                this.nominee = data.nominee;
            }
            if ("expectedAmount" in data && data.expectedAmount != undefined) {
                this.expectedAmount = data.expectedAmount;
            }
            if ("expectedInterest" in data && data.expectedInterest != undefined) {
                this.expectedInterest = data.expectedInterest;
            }
            if ("calculatedDays" in data && data.calculatedDays != undefined) {
                this.calculatedDays = data.calculatedDays;
            }
            if ("isFdActive" in data && data.isFdActive != undefined) {
                this.isFdActive = data.isFdActive;
            }
            if ("isFdBroken" in data && data.isFdBroken != undefined) {
                this.isFdBroken = data.isFdBroken;
            }
            if ("originalUser" in data && data.originalUser != undefined) {
                this.originalUser = data.originalUser;
            }
            if ("annualBreakdownList" in data && data.annualBreakdownList != undefined) {
                this.annualBreakdownList = data.annualBreakdownList;
            }
            if ("accountType" in data && data.accountType != undefined) {
                this.accountType = data.accountType;
            }
            if ("freeze" in data && data.freeze != undefined) {
                this.freeze = data.freeze;
            }
            if ("renewalType" in data && data.renewalType != undefined) {
                this.renewalType = data.renewalType;
            }
            if ("externalId" in data && data.externalId != undefined) {
                this.externalId = data.externalId;
            }
        }
    }
    get user() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set user(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get fdNumber() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set fdNumber(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get customerId() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set customerId(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get bankIFSC() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set bankIFSC(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get depositAmount() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set depositAmount(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get rateOfInterest() {
        return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
    }
    set rateOfInterest(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get startDate() {
        return pb_1.Message.getFieldWithDefault(this, 7, "") as string;
    }
    set startDate(value: string) {
        pb_1.Message.setField(this, 7, value);
    }
    get endDate() {
        return pb_1.Message.getFieldWithDefault(this, 8, "") as string;
    }
    set endDate(value: string) {
        pb_1.Message.setField(this, 8, value);
    }
    get months() {
        return pb_1.Message.getFieldWithDefault(this, 9, 0) as number;
    }
    set months(value: number) {
        pb_1.Message.setField(this, 9, value);
    }
    get days() {
        return pb_1.Message.getFieldWithDefault(this, 10, 0) as number;
    }
    set days(value: number) {
        pb_1.Message.setField(this, 10, value);
    }
    get interestType() {
        return pb_1.Message.getFieldWithDefault(this, 11, InterestType.ON_MATURITY) as InterestType;
    }
    set interestType(value: InterestType) {
        pb_1.Message.setField(this, 11, value);
    }
    get nominee() {
        return pb_1.Message.getFieldWithDefault(this, 12, "") as string;
    }
    set nominee(value: string) {
        pb_1.Message.setField(this, 12, value);
    }
    get expectedAmount() {
        return pb_1.Message.getFieldWithDefault(this, 13, 0) as number;
    }
    set expectedAmount(value: number) {
        pb_1.Message.setField(this, 13, value);
    }
    get expectedInterest() {
        return pb_1.Message.getFieldWithDefault(this, 14, 0) as number;
    }
    set expectedInterest(value: number) {
        pb_1.Message.setField(this, 14, value);
    }
    get calculatedDays() {
        return pb_1.Message.getFieldWithDefault(this, 15, 0) as number;
    }
    set calculatedDays(value: number) {
        pb_1.Message.setField(this, 15, value);
    }
    get isFdActive() {
        return pb_1.Message.getFieldWithDefault(this, 16, false) as boolean;
    }
    set isFdActive(value: boolean) {
        pb_1.Message.setField(this, 16, value);
    }
    get isFdBroken() {
        return pb_1.Message.getFieldWithDefault(this, 17, false) as boolean;
    }
    set isFdBroken(value: boolean) {
        pb_1.Message.setField(this, 17, value);
    }
    get originalUser() {
        return pb_1.Message.getFieldWithDefault(this, 18, "") as string;
    }
    set originalUser(value: string) {
        pb_1.Message.setField(this, 18, value);
    }
    get annualBreakdownList() {
        return pb_1.Message.getWrapperField(this, AnnualBreakdownList, 19) as AnnualBreakdownList;
    }
    set annualBreakdownList(value: AnnualBreakdownList) {
        pb_1.Message.setWrapperField(this, 19, value);
    }
    get has_annualBreakdownList() {
        return pb_1.Message.getField(this, 19) != null;
    }
    get accountType() {
        return pb_1.Message.getFieldWithDefault(this, 20, AccountType.IND) as AccountType;
    }
    set accountType(value: AccountType) {
        pb_1.Message.setField(this, 20, value);
    }
    get freeze() {
        return pb_1.Message.getFieldWithDefault(this, 21, 0) as number;
    }
    set freeze(value: number) {
        pb_1.Message.setField(this, 21, value);
    }
    get renewalType() {
        return pb_1.Message.getFieldWithDefault(this, 22, RenewalType.RENEW_AMOUNT) as RenewalType;
    }
    set renewalType(value: RenewalType) {
        pb_1.Message.setField(this, 22, value);
    }

    get externalId() {
        return pb_1.Message.getFieldWithDefault(this, 23, "") as string;
    }

    set externalId(value: string) {
        pb_1.Message.setField(this, 23, value);
    }
    static fromObject(data: {
        user?: string;
        fdNumber?: string;
        customerId?: string;
        bankIFSC?: string;
        depositAmount?: number;
        rateOfInterest?: number;
        startDate?: string;
        endDate?: string;
        months?: number;
        days?: number;
        interestType?: InterestType;
        nominee?: string;
        expectedAmount?: number;
        expectedInterest?: number;
        calculatedDays?: number;
        isFdActive?: boolean;
        isFdBroken?: boolean;
        originalUser?: string;
        annualBreakdownList?: ReturnType<typeof AnnualBreakdownList.prototype.toObject>;
        accountType?: AccountType;
        freeze?: number;
        renewalType?: RenewalType;
        externalId?: string;
    }): FixedDeposit {
        const message = new FixedDeposit({});
        if (data.user != null) {
            message.user = data.user;
        }
        if (data.fdNumber != null) {
            message.fdNumber = data.fdNumber;
        }
        if (data.customerId != null) {
            message.customerId = data.customerId;
        }
        if (data.bankIFSC != null) {
            message.bankIFSC = data.bankIFSC;
        }
        if (data.depositAmount != null) {
            message.depositAmount = data.depositAmount;
        }
        if (data.rateOfInterest != null) {
            message.rateOfInterest = data.rateOfInterest;
        }
        if (data.startDate != null) {
            message.startDate = data.startDate;
        }
        if (data.endDate != null) {
            message.endDate = data.endDate;
        }
        if (data.months != null) {
            message.months = data.months;
        }
        if (data.days != null) {
            message.days = data.days;
        }
        if (data.interestType != null) {
            message.interestType = data.interestType;
        }
        if (data.nominee != null) {
            message.nominee = data.nominee;
        }
        if (data.expectedAmount != null) {
            message.expectedAmount = data.expectedAmount;
        }
        if (data.expectedInterest != null) {
            message.expectedInterest = data.expectedInterest;
        }
        if (data.calculatedDays != null) {
            message.calculatedDays = data.calculatedDays;
        }
        if (data.isFdActive != null) {
            message.isFdActive = data.isFdActive;
        }
        if (data.isFdBroken != null) {
            message.isFdBroken = data.isFdBroken;
        }
        if (data.originalUser != null) {
            message.originalUser = data.originalUser;
        }
        if (data.annualBreakdownList != null) {
            message.annualBreakdownList = AnnualBreakdownList.fromObject(data.annualBreakdownList);
        }
        if (data.accountType != null) {
            message.accountType = data.accountType;
        }
        if (data.freeze != null) {
            message.freeze = data.freeze;
        }
        if (data.renewalType != null) {
            message.renewalType = data.renewalType;
        }
        if (data.externalId != null) {
            message.externalId = data.externalId;
        }
        return message;
    }

    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): FixedDeposit {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new FixedDeposit();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.user = reader.readString();
                    break;
                case 2:
                    message.fdNumber = reader.readString();
                    break;
                case 3:
                    message.customerId = reader.readString();
                    break;
                case 4:
                    message.bankIFSC = reader.readString();
                    break;
                case 5:
                    message.depositAmount = reader.readDouble();
                    break;
                case 6:
                    message.rateOfInterest = reader.readDouble();
                    break;
                case 7:
                    message.startDate = reader.readString();
                    break;
                case 8:
                    message.endDate = reader.readString();
                    break;
                case 9:
                    message.months = reader.readInt32();
                    break;
                case 10:
                    message.days = reader.readInt32();
                    break;
                case 11:
                    message.interestType = reader.readEnum();
                    break;
                case 12:
                    message.nominee = reader.readString();
                    break;
                case 13:
                    message.expectedAmount = reader.readDouble();
                    break;
                case 14:
                    message.expectedInterest = reader.readDouble();
                    break;
                case 15:
                    message.calculatedDays = reader.readInt32();
                    break;
                case 16:
                    message.isFdActive = reader.readBool();
                    break;
                case 17:
                    message.isFdBroken = reader.readBool();
                    break;
                case 18:
                    message.originalUser = reader.readString();
                    break;
                case 19:
                    reader.readMessage(message.annualBreakdownList, () => message.annualBreakdownList = AnnualBreakdownList.deserialize(reader));
                    break;
                case 20:
                    message.accountType = reader.readEnum();
                    break;
                case 21:
                    message.freeze = reader.readInt32();
                    break;
                case 22:
                    message.renewalType = reader.readEnum();
                    break;
                case 23:
                    message.externalId = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;

    toObject() {
        const data: {
            user?: string;
            fdNumber?: string;
            customerId?: string;
            bankIFSC?: string;
            depositAmount?: number;
            rateOfInterest?: number;
            startDate?: string;
            endDate?: string;
            months?: number;
            days?: number;
            interestType?: InterestType;
            nominee?: string;
            expectedAmount?: number;
            expectedInterest?: number;
            calculatedDays?: number;
            isFdActive?: boolean;
            isFdBroken?: boolean;
            originalUser?: string;
            annualBreakdownList?: ReturnType<typeof AnnualBreakdownList.prototype.toObject>;
            accountType?: AccountType;
            freeze?: number;
            renewalType?: RenewalType;
            externalId?: string;
        } = {};
        if (this.user != null) {
            data.user = this.user;
        }
        if (this.fdNumber != null) {
            data.fdNumber = this.fdNumber;
        }
        if (this.customerId != null) {
            data.customerId = this.customerId;
        }
        if (this.bankIFSC != null) {
            data.bankIFSC = this.bankIFSC;
        }
        if (this.depositAmount != null) {
            data.depositAmount = this.depositAmount;
        }
        if (this.rateOfInterest != null) {
            data.rateOfInterest = this.rateOfInterest;
        }
        if (this.startDate != null) {
            data.startDate = this.startDate;
        }
        if (this.endDate != null) {
            data.endDate = this.endDate;
        }
        if (this.months != null) {
            data.months = this.months;
        }
        if (this.days != null) {
            data.days = this.days;
        }
        if (this.interestType != null) {
            data.interestType = this.interestType;
        }
        if (this.nominee != null) {
            data.nominee = this.nominee;
        }
        if (this.expectedAmount != null) {
            data.expectedAmount = this.expectedAmount;
        }
        if (this.expectedInterest != null) {
            data.expectedInterest = this.expectedInterest;
        }
        if (this.calculatedDays != null) {
            data.calculatedDays = this.calculatedDays;
        }
        if (this.isFdActive != null) {
            data.isFdActive = this.isFdActive;
        }
        if (this.isFdBroken != null) {
            data.isFdBroken = this.isFdBroken;
        }
        if (this.originalUser != null) {
            data.originalUser = this.originalUser;
        }
        if (this.annualBreakdownList != null) {
            data.annualBreakdownList = this.annualBreakdownList.toObject();
        }
        if (this.accountType != null) {
            data.accountType = this.accountType;
        }
        if (this.freeze != null) {
            data.freeze = this.freeze;
        }
        if (this.renewalType != null) {
            data.renewalType = this.renewalType;
        }
        if (this.externalId != null) {
            data.externalId = this.externalId;
        }
        return data;
    }

    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.user.length)
            writer.writeString(1, this.user);
        if (this.fdNumber.length)
            writer.writeString(2, this.fdNumber);
        if (this.customerId.length)
            writer.writeString(3, this.customerId);
        if (this.bankIFSC.length)
            writer.writeString(4, this.bankIFSC);
        if (this.depositAmount != 0)
            writer.writeDouble(5, this.depositAmount);
        if (this.rateOfInterest != 0)
            writer.writeDouble(6, this.rateOfInterest);
        if (this.startDate.length)
            writer.writeString(7, this.startDate);
        if (this.endDate.length)
            writer.writeString(8, this.endDate);
        if (this.months != 0)
            writer.writeInt32(9, this.months);
        if (this.days != 0)
            writer.writeInt32(10, this.days);
        if (this.interestType != InterestType.ON_MATURITY)
            writer.writeEnum(11, this.interestType);
        if (this.nominee.length)
            writer.writeString(12, this.nominee);
        if (this.expectedAmount != 0)
            writer.writeDouble(13, this.expectedAmount);
        if (this.expectedInterest != 0)
            writer.writeDouble(14, this.expectedInterest);
        if (this.calculatedDays != 0)
            writer.writeInt32(15, this.calculatedDays);
        if (this.isFdActive != false)
            writer.writeBool(16, this.isFdActive);
        if (this.isFdBroken != false)
            writer.writeBool(17, this.isFdBroken);
        if (this.originalUser.length)
            writer.writeString(18, this.originalUser);
        if (this.has_annualBreakdownList)
            writer.writeMessage(19, this.annualBreakdownList, () => this.annualBreakdownList.serialize(writer));
        if (this.accountType != AccountType.IND)
            writer.writeEnum(20, this.accountType);
        if (this.freeze != 0)
            writer.writeInt32(21, this.freeze);
        if (this.renewalType != RenewalType.RENEW_AMOUNT)
            writer.writeEnum(22, this.renewalType);
        if (this.externalId.length)
            writer.writeString(23, this.externalId);
        if (!w)
            return writer.getResultBuffer();
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): FixedDeposit {
        return FixedDeposit.deserialize(bytes);
    }
}
export class FixedDepositList extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        FixedDeposit?: FixedDeposit[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("FixedDeposit" in data && data.FixedDeposit != undefined) {
                this.FixedDeposit = data.FixedDeposit;
            }
        }
    }
    get FixedDeposit() {
        return pb_1.Message.getRepeatedWrapperField(this, FixedDeposit, 1) as FixedDeposit[];
    }
    set FixedDeposit(value: FixedDeposit[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    static fromObject(data: {
        FixedDeposit?: ReturnType<typeof FixedDeposit.prototype.toObject>[];
    }): FixedDepositList {
        const message = new FixedDepositList({});
        if (data.FixedDeposit != null) {
            message.FixedDeposit = data.FixedDeposit.map(item => FixedDeposit.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            FixedDeposit?: ReturnType<typeof FixedDeposit.prototype.toObject>[];
        } = {};
        if (this.FixedDeposit != null) {
            data.FixedDeposit = this.FixedDeposit.map((item: FixedDeposit) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.FixedDeposit.length)
            writer.writeRepeatedMessage(1, this.FixedDeposit, (item: FixedDeposit) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): FixedDepositList {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new FixedDepositList();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.FixedDeposit, () => pb_1.Message.addToRepeatedWrapperField(message, 1, FixedDeposit.deserialize(reader), FixedDeposit));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): FixedDepositList {
        return FixedDepositList.deserialize(bytes);
    }
}
export class AnnualBreakdown extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        startDate?: string;
        endDate?: string;
        daysInBetween?: number;
        expectedInterestGained?: number;
        expectedAmountAccumulated?: number;
        financialYear?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("startDate" in data && data.startDate != undefined) {
                this.startDate = data.startDate;
            }
            if ("endDate" in data && data.endDate != undefined) {
                this.endDate = data.endDate;
            }
            if ("daysInBetween" in data && data.daysInBetween != undefined) {
                this.daysInBetween = data.daysInBetween;
            }
            if ("expectedInterestGained" in data && data.expectedInterestGained != undefined) {
                this.expectedInterestGained = data.expectedInterestGained;
            }
            if ("expectedAmountAccumulated" in data && data.expectedAmountAccumulated != undefined) {
                this.expectedAmountAccumulated = data.expectedAmountAccumulated;
            }
            if ("financialYear" in data && data.financialYear != undefined) {
                this.financialYear = data.financialYear;
            }
        }
    }
    get startDate() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set startDate(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get endDate() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set endDate(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get daysInBetween() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set daysInBetween(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get expectedInterestGained() {
        return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
    }
    set expectedInterestGained(value: number) {
        pb_1.Message.setField(this, 4, value);
    }
    get expectedAmountAccumulated() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set expectedAmountAccumulated(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get financialYear() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set financialYear(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    static fromObject(data: {
        startDate?: string;
        endDate?: string;
        daysInBetween?: number;
        expectedInterestGained?: number;
        expectedAmountAccumulated?: number;
        financialYear?: string;
    }): AnnualBreakdown {
        const message = new AnnualBreakdown({});
        if (data.startDate != null) {
            message.startDate = data.startDate;
        }
        if (data.endDate != null) {
            message.endDate = data.endDate;
        }
        if (data.daysInBetween != null) {
            message.daysInBetween = data.daysInBetween;
        }
        if (data.expectedInterestGained != null) {
            message.expectedInterestGained = data.expectedInterestGained;
        }
        if (data.expectedAmountAccumulated != null) {
            message.expectedAmountAccumulated = data.expectedAmountAccumulated;
        }
        if (data.financialYear != null) {
            message.financialYear = data.financialYear;
        }
        return message;
    }
    toObject() {
        const data: {
            startDate?: string;
            endDate?: string;
            daysInBetween?: number;
            expectedInterestGained?: number;
            expectedAmountAccumulated?: number;
            financialYear?: string;
        } = {};
        if (this.startDate != null) {
            data.startDate = this.startDate;
        }
        if (this.endDate != null) {
            data.endDate = this.endDate;
        }
        if (this.daysInBetween != null) {
            data.daysInBetween = this.daysInBetween;
        }
        if (this.expectedInterestGained != null) {
            data.expectedInterestGained = this.expectedInterestGained;
        }
        if (this.expectedAmountAccumulated != null) {
            data.expectedAmountAccumulated = this.expectedAmountAccumulated;
        }
        if (this.financialYear != null) {
            data.financialYear = this.financialYear;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.startDate.length)
            writer.writeString(1, this.startDate);
        if (this.endDate.length)
            writer.writeString(2, this.endDate);
        if (this.daysInBetween != 0)
            writer.writeInt64(3, this.daysInBetween);
        if (this.expectedInterestGained != 0)
            writer.writeDouble(4, this.expectedInterestGained);
        if (this.expectedAmountAccumulated != 0)
            writer.writeDouble(5, this.expectedAmountAccumulated);
        if (this.financialYear.length)
            writer.writeString(6, this.financialYear);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AnnualBreakdown {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new AnnualBreakdown();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.startDate = reader.readString();
                    break;
                case 2:
                    message.endDate = reader.readString();
                    break;
                case 3:
                    message.daysInBetween = reader.readInt64();
                    break;
                case 4:
                    message.expectedInterestGained = reader.readDouble();
                    break;
                case 5:
                    message.expectedAmountAccumulated = reader.readDouble();
                    break;
                case 6:
                    message.financialYear = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): AnnualBreakdown {
        return AnnualBreakdown.deserialize(bytes);
    }
}
export class AnnualBreakdownList extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        annualBreakdown?: AnnualBreakdown[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("annualBreakdown" in data && data.annualBreakdown != undefined) {
                this.annualBreakdown = data.annualBreakdown;
            }
        }
    }
    get annualBreakdown() {
        return pb_1.Message.getRepeatedWrapperField(this, AnnualBreakdown, 1) as AnnualBreakdown[];
    }
    set annualBreakdown(value: AnnualBreakdown[]) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
    }
    static fromObject(data: {
        annualBreakdown?: ReturnType<typeof AnnualBreakdown.prototype.toObject>[];
    }): AnnualBreakdownList {
        const message = new AnnualBreakdownList({});
        if (data.annualBreakdown != null) {
            message.annualBreakdown = data.annualBreakdown.map(item => AnnualBreakdown.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            annualBreakdown?: ReturnType<typeof AnnualBreakdown.prototype.toObject>[];
        } = {};
        if (this.annualBreakdown != null) {
            data.annualBreakdown = this.annualBreakdown.map((item: AnnualBreakdown) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.annualBreakdown.length)
            writer.writeRepeatedMessage(1, this.annualBreakdown, (item: AnnualBreakdown) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AnnualBreakdownList {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new AnnualBreakdownList();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.annualBreakdown, () => pb_1.Message.addToRepeatedWrapperField(message, 1, AnnualBreakdown.deserialize(reader), AnnualBreakdown));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): AnnualBreakdownList {
        return AnnualBreakdownList.deserialize(bytes);
    }
}
