//
//  MercuryMain.m
//  Mercury
//
//  Created by Jamieson Abbott on 3/13/12.
//  Copyright (c) 2012 AM Interfaces. All rights reserved.
//

#import "MercuryMain.h"
#import "MercuryLayoutView.h"
#import "MercuryStaticVariables.h"

#import "MercurySubMenu.h"
#import "AMConstants.h"

@implementation MercuryMain

@synthesize menu;
@synthesize currentjson;
@synthesize rootview;
@synthesize dialogparent;

- (id)initWithMenu:(UINavigationController *)inmenu
{
    self = [self initWithMenu:inmenu showLogoutButton:YES];
    if(self)
    {
        
    }
    return self;
}

- (id)initWithMenu:(UINavigationController *)inmenu showLogoutButton:(BOOL) showlogout
{
    self = [super init];
    if(self)
    {
        self.menu = inmenu;
        //self.view = [[MercuryLayoutView alloc] init];
        
        if(inmenu != nil)
        {
        UIBarButtonItem* barbuttonitem = [[UIBarButtonItem alloc] initWithTitle:@"Main Menu" style:UIBarButtonItemStyleBordered target:self action:@selector(showMenu)];
        self.navigationItem.rightBarButtonItem = barbuttonitem;   
        }
        if(showlogout)
        {
            UIBarButtonItem* logoutbutton = [[UIBarButtonItem alloc] initWithTitle:@"Logout" style:UIBarButtonItemStyleBordered target:self action:@selector(logout)];
            self.navigationItem.leftBarButtonItem = logoutbutton;
            [self showLandingScreen];
        }
    }
    return self;
}

- (void)showMenu
{       
    MercuryMenu* menuref = [self.menu.childViewControllers objectAtIndex:0];
    menuref.displayviewcontroller = self;
    [menuref reloadMenu];
    [self presentModalViewController:self.menu animated:YES];
}

- (void)logout
{    
    NSMutableDictionary* postdata = [[NSMutableDictionary alloc] init];
    [postdata setObject:[AMConstants C:REQUEST_TYPE_LOGOUT] forKey:[AMConstants C:REQUEST_TYPE_IDENTIFIER]]; 
    [MercuryStaticVariables fillDictionary:postdata withPersistDictionary:[MercuryStaticVariables sharedInstance].persist];
    [MercuryDataManager sendRequest:postdata withTarget:self andSelector:@selector(dataManager:logoutresponse:)];
}

- (void) loadNewObjectName:(NSString*) actionname
{
    NSMutableDictionary* postdata = [[NSMutableDictionary alloc] init];
    [postdata setObject:[AMConstants C:REQUEST_TYPE_FULL_DEFINITION] forKey:[AMConstants C:REQUEST_TYPE_IDENTIFIER]]; 
    [postdata setObject:actionname forKey:[AMConstants C:REQUEST_OBJECT_NAME]];
    
    [MercuryStaticVariables fillDictionary:postdata withPersistDictionary:[MercuryStaticVariables sharedInstance].persist];
    
    [MercuryDataManager sendRequest:postdata withTarget:self andSelector:@selector(dataManager:Actionresponse:)];
}

- (void) loadNewObjectName:(NSString *)actionname additionalFields:(NSDictionary*) additionalfields
{
    NSMutableDictionary* postdata = [[NSMutableDictionary alloc] init];
    [postdata setObject:[AMConstants C:REQUEST_TYPE_FULL_DEFINITION] forKey:[AMConstants C:REQUEST_TYPE_IDENTIFIER]]; 
    [postdata setObject:actionname forKey:[AMConstants C:REQUEST_OBJECT_NAME]];
    [postdata addEntriesFromDictionary:additionalfields];
    [MercuryStaticVariables fillDictionary:postdata withPersistDictionary:[MercuryStaticVariables sharedInstance].persist];
    
    [MercuryDataManager sendRequest:postdata withTarget:self andSelector:@selector(dataManager:Actionresponse:)];
}

-(void) dataManager:(MercuryDataManager*) datamanager Actionresponse:(NSDictionary *) response
{
    [self setPageJSON:response];    
}

- (void)setPageJSON:(NSDictionary*) pagejson
{
 //   NSLog(@"%@", pagejson);
    currentjson = pagejson;
    self.title = [pagejson objectForKey:OBJECT_NAME];
    for(UIView* curview in self.view.subviews)
    {
        [curview removeFromSuperview];
    }
    NSDictionary* responsebody = [currentjson objectForKey:[AMConstants C:RESPONSE_BODY]];
    NSArray* menuarray = [responsebody objectForKey:[AMConstants C:MENU_ARRAY]];
    CGRect mainframe;
    if(menuarray == nil)
    {
        mainframe = CGRectMake(self.view.frame.origin.x, self.view.frame.origin.y, self.view.frame.size.width, self.view.frame.size.height);
    }
    else 
    {
        UIButton* submenubutton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        submenubutton.frame = CGRectMake(self.view.frame.size.width-75, 2, 75, 30);
        [submenubutton setTitle:@"Sub Menu" forState:UIControlStateNormal];
        [submenubutton addTarget:self action:@selector(showSubMenu) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:submenubutton];
        mainframe = CGRectMake(self.view.frame.origin.x, 34, self.view.frame.size.width, self.view.frame.size.height-40);
    }
    MercuryLayoutView* newlayoutview = [[MercuryLayoutView alloc] initWithFrame:mainframe];
    newlayoutview.parentcontroller = self;
    self.rootview = newlayoutview;
    [self.view addSubview:newlayoutview];

    [newlayoutview loadJSON:[responsebody objectForKey:[AMConstants C:ROOT_OBJECT]] withRootDefinition:currentjson andClearChildren:YES];
    
}

- (void) showSubMenu
{
    MercurySubMenu* submenu = [[MercurySubMenu alloc] init];
    submenu.menujson = [[self.currentjson objectForKey:[AMConstants C:RESPONSE_BODY]] objectForKey:[AMConstants C:MENU_ARRAY]];
    submenu.displayviewcontroller = self;
    [self presentModalViewController:submenu animated:YES];
}

- (void) dataManager:(MercuryDataManager*) datamanager logoutresponse:(NSDictionary *) response
{     
    [self showMenu];
}

- (void) showLandingScreen
{
    NSMutableDictionary* postdata = [[NSMutableDictionary alloc] init];
    [postdata setObject:[AMConstants C:REQUEST_TYPE_LANDING_NAME] forKey:[AMConstants C:REQUEST_TYPE_IDENTIFIER]];    
    [MercuryStaticVariables fillDictionary:postdata withPersistDictionary:[MercuryStaticVariables sharedInstance].persist];
    [MercuryDataManager sendRequest:postdata withTarget:self andSelector:@selector(dataManager:LandingPageNameresponse:)];
}

- (void) dataManager:(MercuryDataManager *)datamanager LandingPageNameresponse:(NSDictionary *) response
{  
    [self loadNewObjectName:[response objectForKey:[AMConstants C:OBJECT_NAME]]];    
}


@end
