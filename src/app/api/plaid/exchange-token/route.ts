import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";
import { CountryCode } from "plaid";

export async function POST(request: Request) {
  try {
    const { public_token } = await request.json();

    // Exchange the public token for an access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = exchangeResponse.data;

    // Get institution details
    const itemResponse = await plaidClient.itemGet({
      access_token,
    });

    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: itemResponse.data.item.institution_id!,
      country_codes: [CountryCode.Us],
    });

    // Save the connection to our database
    const plaidItem = await prisma.plaidItem.create({
      data: {
        itemId: item_id,
        accessToken: access_token,
        institutionId: itemResponse.data.item.institution_id!,
        institutionName: institutionResponse.data.institution.name,
        institutionLogo: institutionResponse.data.institution.logo,
      },
    });

    // Get accounts and save them
    const accountsResponse = await plaidClient.accountsGet({
      access_token,
    });

    // Save initial account balances
    for (const account of accountsResponse.data.accounts) {
      const savedAccount = await prisma.account.create({
        data: {
          plaidId: account.account_id,
          name: account.name,
          type: account.type,
          subtype: account.subtype || null,
          mask: account.mask || null,
          itemId: plaidItem.id,
        },
      });

      // Save initial balance
      await prisma.accountBalance.create({
        data: {
          accountId: savedAccount.id,
          current: account.balances.current || 0,
          available: account.balances.available,
          limit: account.balances.limit,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error exchanging token:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}